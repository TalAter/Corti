import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import corti from '../src/corti';

beforeAll(() => {
  vi.stubGlobal('SpeechRecognition', corti);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

let recognition;
let spyFn1;

beforeEach(() => {
  spyFn1 = vi.fn();
  recognition = new globalThis.SpeechRecognition();
  recognition.addEventListener('result', spyFn1);
});

describe('SpeechRecognition.say()', () => {
  it("should do nothing when speech recognition isn't started", () => {
    recognition.say("You can't take the sky from me");
    expect(spyFn1).toBeCalledTimes(0);
  });

  it('should fire the result event once per phrase said', () => {
    recognition.continuous = true;
    recognition.start();
    expect(spyFn1).toBeCalledTimes(0);
    recognition.say("You can't take the sky from me");
    expect(spyFn1).toBeCalledTimes(1);
    recognition.say('Well, my time of not taking you seriously is coming to a middle');
    expect(spyFn1).toBeCalledTimes(2);
  });
});
