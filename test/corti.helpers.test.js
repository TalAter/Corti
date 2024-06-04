import { afterAll, beforeEach, beforeAll, vi, it, expect, describe } from 'vitest';

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
});

describe('SpeechRecognition.say()', () => {
  it("should do nothing when speech recognition isn't started", () => {
    recognition.addEventListener('result', spyFn1);
    recognition.say("You can't take the sky from me");
    expect(spyFn1).toBeCalledTimes(0);
  });

  it('should fire the result event once per phrase said', () => {
    recognition.addEventListener('result', spyFn1);
    recognition.continuous = true;
    recognition.start();
    expect(spyFn1).toBeCalledTimes(0);
    recognition.say("You can't take the sky from me");
    expect(spyFn1).toBeCalledTimes(1);
    recognition.say('Well, my time of not taking you seriously is coming to a middle');
    expect(spyFn1).toBeCalledTimes(2);
  });
});
