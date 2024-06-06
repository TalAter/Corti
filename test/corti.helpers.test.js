import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getLastSpiedSpeechRecognitionEvent, getSentence } from './testUtils';

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
    recognition.abort();
    recognition.say(getSentence(0));
    expect(spyFn1).toBeCalledTimes(0);
  });

  it('should fire the result event once per phrase said', () => {
    recognition.continuous = true;
    recognition.start();
    expect(spyFn1).toBeCalledTimes(0);
    recognition.say(getSentence(0));
    expect(spyFn1).toBeCalledTimes(1);
    recognition.say(getSentence(1));
    expect(spyFn1).toBeCalledTimes(2);
  });
});
