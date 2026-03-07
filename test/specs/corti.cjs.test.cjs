import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getLastSpiedSpeechRecognitionEvent, getSentence } from '../testUtils';

const {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionResultList,
  SpeechRecognitionResult,
  SpeechRecognitionAlternative,
} = require('../../dist/corti.cjs');

beforeAll(() => {
  vi.stubGlobal('SpeechRecognition', SpeechRecognition);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe('SpeechRecognition', () => {
  let recognition;
  let spyFn1;

  beforeEach(() => {
    spyFn1 = vi.fn();
    recognition = new globalThis.SpeechRecognition();
    recognition.addEventListener('result', spyFn1);
    recognition.continuous = true;
    recognition.start();
    recognition.say(getSentence(0));
  });

  it('should exist in global namespace', () => {
    expect(globalThis.SpeechRecognition).toBeDefined();
  });

  it('should return an instance of SpeechRecognition when called with new', () => {
    expect(recognition).toBeInstanceOf(globalThis.SpeechRecognition);
  });

  describe('when recognizing speech should contain', () => {
    it('SpeechRecognitionEvent', () => {
      expect(spyFn1).toHaveBeenLastCalledWith(expect.any(SpeechRecognitionEvent));
    });

    it('SpeechRecognitionResultList', () => {
      expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results).toBeInstanceOf(SpeechRecognitionResultList);
    });

    it('SpeechRecognitionResult', () => {
      expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0)).toBeInstanceOf(SpeechRecognitionResult);
    });

    it('SpeechRecognitionAlternative', () => {
      expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0).item(0)).toBeInstanceOf(
        SpeechRecognitionAlternative
      );
    });
  });
});
