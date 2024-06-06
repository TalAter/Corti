import { afterAll, beforeAll, beforeEach, describe, expect, it, test, vi } from 'vitest';
import { getLastSpiedSpeechRecognitionEvent, getSentence } from '../testUtils';

import corti from '../../src/corti';
import SpeechRecognitionEvent from '../../src/SpeechRecognitionEvent';
import SpeechRecognitionResultList from '../../src/SpeechRecognitionResultList';
import SpeechRecognitionResult from '../../src/SpeechRecognitionResult';
import SpeechRecognitionAlternative from '../../src/SpeechRecognitionAlternative';

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
  recognition.say(getSentence(0));
});

describe('SpeechRecognitionEvent', () => {
  it('should be a SpeechRecognitionEvent object', () => {
    expect(spyFn1).toHaveBeenLastCalledWith(expect.any(SpeechRecognitionEvent));
  });

  it('should contain a results property with a SpeechRecognitionResultList object', () => {
    expect(spyFn1).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'result',
        results: expect.any(SpeechRecognitionResultList),
      })
    );
  });

  it('should contain a resultIndex property with the value 0', () => {
    expect(spyFn1).toHaveBeenLastCalledWith(
      expect.objectContaining({
        resultIndex: 0,
      })
    );
  });

  it('should contain a emma property with the value null', () => {
    expect(spyFn1).toHaveBeenLastCalledWith(
      expect.objectContaining({
        emma: null,
      })
    );
  });

  it('should contain a interpretation property with the value null', () => {
    expect(spyFn1).toHaveBeenLastCalledWith(
      expect.objectContaining({
        interpretation: null,
      })
    );
  });
});

describe('SpeechRecognitionResultList (SpeechRecognitionEvent.results)', () => {
  let resultListObject;

  beforeEach(() => {
    resultListObject = getLastSpiedSpeechRecognitionEvent(spyFn1).results;
  });

  it('should be a SpeechRecognitionResultList object', () => {
    expect(resultListObject).toBeInstanceOf(SpeechRecognitionResultList);
  });

  describe('.length', () => {
    it('should return a number', () => {
      expect(resultListObject.length).toBeDefined();
      expect(resultListObject.length).toEqual(expect.any(Number));
    });
  });

  it('should be iterable', () => {
    expect(resultListObject[Symbol.iterator]).toEqual(expect.any(Function));
    expect([...resultListObject]).toEqual([expect.any(SpeechRecognitionResult)]);
    let count = 0;
    /* eslint-disable no-restricted-syntax */
    for (const result of resultListObject) {
      expect(result).toEqual(expect.any(SpeechRecognitionResult));
      count += 1;
    }
    expect(count).toEqual(1);
  });

  describe('.item()', () => {
    it('should return the SpeechRecognitionResult at the given index', () => {
      expect(resultListObject.item).toEqual(expect.any(Function));
      expect(resultListObject.item(0)).toEqual(expect.any(SpeechRecognitionResult));
    });

    it('should return null if the given index is out of bounds', () => {
      expect(resultListObject.item(999)).toEqual(null);
    });

    it('should return the first result if the given index is not a number', () => {
      expect(resultListObject.item('goldstar')).toEqual(resultListObject.item(0));
      expect(resultListObject.item(NaN)).toEqual(resultListObject.item(0));
    });

    it('should throw a TypeError if called with no arguments', () => {
      expect(() => resultListObject.item()).toThrowError(TypeError);
      expect(() => resultListObject.item()).toThrowError(
        "Failed to execute 'item' on 'SpeechRecognitionResultList': 1 argument required, but only 0 present."
      );
    });
  });

  test('should have a length equal to the number of results returned', () => {
    expect(resultListObject.length).toEqual(1);
  });
});

describe('SpeechRecognitionResult', () => {
  let resultObject;

  beforeEach(() => {
    resultObject = getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0);
  });

  it('should be a SpeechRecognitionResult object', () => {
    expect(resultObject).toBeInstanceOf(SpeechRecognitionResult);
  });

  describe('.length', () => {
    it('should return a number', () => {
      expect(resultObject.length).toBeDefined();
      expect(resultObject.length).toEqual(expect.any(Number));
    });

    it('should be equal to the maxAlternatives setting', () => {
      recognition.maxAlternatives = 1;
      recognition.say(getSentence(1));
      expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0).length).toEqual(1);
      recognition.maxAlternatives = 4;
      recognition.say(getSentence(2));
      expect(getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0).length).toEqual(4);
    });
  });

  describe('.item()', () => {
    it('should return the SpeechRecognitionAlternative at the given index', () => {
      expect(resultObject.item).toEqual(expect.any(Function));
      expect(resultObject.item(0)).toEqual(expect.any(SpeechRecognitionAlternative));
    });

    it('should return null if the given index is out of bounds', () => {
      expect(resultObject.item(999)).toEqual(null);
    });

    it('should return the first result if the given index is not a number', () => {
      expect(resultObject.item('goldstar')).toEqual(resultObject.item(0));
      expect(resultObject.item(NaN)).toEqual(resultObject.item(0));
    });

    it('should throw a TypeError if called with no arguments', () => {
      expect(() => resultObject.item()).toThrowError(TypeError);
      expect(() => resultObject.item()).toThrowError(
        "Failed to execute 'item' on 'SpeechRecognitionResult': 1 argument required, but only 0 present."
      );
    });
  });

  it('should contain an isFinal attribute with a value of true', () => {
    expect(resultObject.isFinal).toEqual(true);
  });

  it('should be iterable', () => {
    expect(resultObject[Symbol.iterator]).toEqual(expect.any(Function));
    expect([...resultObject]).toEqual([expect.any(SpeechRecognitionAlternative)]);
    let count = 0;
    /* eslint-disable no-restricted-syntax */
    for (const result of resultObject) {
      expect(result).toEqual(expect.any(SpeechRecognitionAlternative));
      count += 1;
    }
    expect(count).toEqual(1);
  });
});

describe('SpeechRecognitionAlternative', () => {
  let alternativeObject;

  beforeEach(() => {
    alternativeObject = getLastSpiedSpeechRecognitionEvent(spyFn1).results.item(0).item(0);
  });

  it('should be a SpeechRecognitionAlternative object', () => {
    expect(alternativeObject).toBeInstanceOf(SpeechRecognitionAlternative);
  });

  it('should contain a transcript attribute with a string value', () => {
    expect(alternativeObject.transcript).toEqual(expect.any(String));
  });

  it('should contain a confidence attribute with a number between 0 and 1', () => {
    expect(alternativeObject.confidence).toEqual(expect.any(Number));
    expect(alternativeObject.confidence).toBeGreaterThanOrEqual(0);
    expect(alternativeObject.confidence).toBeLessThanOrEqual(1);
  });
});
