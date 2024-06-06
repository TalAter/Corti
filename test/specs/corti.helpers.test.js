import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getLastSpiedSpeechRecognitionEvent, getSentence } from '../testUtils';

import corti from '../../src/corti';

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
  recognition.continuous = true;
  recognition.start();
});

describe('SpeechRecognition.say()', () => {
  it("should do nothing when speech recognition isn't started", () => {
    recognition.abort();
    recognition.say(getSentence(0));
    expect(spyFn1).toBeCalledTimes(0);
  });

  it('should fire the result event once per phrase said', () => {
    expect(spyFn1).toBeCalledTimes(0);
    recognition.say(getSentence(0));
    expect(spyFn1).toBeCalledTimes(1);
    recognition.say(getSentence(1));
    expect(spyFn1).toBeCalledTimes(2);
  });

  it('should have the text of the first argument as the transcript of the first SpeechRecognitionAlternative', () => {
    recognition.say(getSentence(0));
    expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0).item(0).transcript).toEqual(
      "You can't take the sky from me"
    );
  });

  describe('should return a SpeechRecognitionResult with a length equal to the maxAlternatives setting', () => {
    it('when called with no alternatives', () => {
      recognition.say(getSentence(0));
      expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0).length).toEqual(1);
      recognition.maxAlternatives = 4;
      recognition.say(getSentence(0));
      expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0).length).toEqual(4);
    });

    it('when called with exact number of alternatives', () => {
      recognition.say(getSentence(0));
      expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0).length).toEqual(1);
      recognition.maxAlternatives = 3;
      recognition.say([getSentence(0), getSentence(1), getSentence(2)]);
      expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0).length).toEqual(3);
    });

    it('when called with too many alternatives', () => {
      recognition.maxAlternatives = 3;
      recognition.say([getSentence(0), getSentence(1), getSentence(2), getSentence(3)]);
      expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0).length).toEqual(3);
    });

    it('when called with too few alternatives', () => {
      recognition.maxAlternatives = 3;
      recognition.say([getSentence(0), getSentence(1)]);
      expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0).length).toEqual(3);
    });
  });

  it('should use the alternatives provided as needed by maxAlternatives', () => {
    recognition.maxAlternatives = 3;
    recognition.say([getSentence(0), getSentence(1)]);
    expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0).item(0).transcript).toEqual(getSentence(0));
    expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0).item(1).transcript).toEqual(getSentence(1));
  });

  it('should create additional SpeechRecognitionAlternative objects when needed', () => {
    recognition.maxAlternatives = 4;
    recognition.say([getSentence(0), getSentence(1)]);
    expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0).item(3).transcript).toEqual(
      `${getSentence(0)} and so on and so forth`
    );
  });
});
