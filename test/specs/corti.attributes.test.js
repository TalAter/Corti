import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getSentence } from '../testUtils';

import { SpeechRecognition } from '../../dist/corti';

beforeAll(() => {
  vi.stubGlobal('SpeechRecognition', SpeechRecognition);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe('SpeechRecognition definition', () => {
  it('should exist in global namespace', () => {
    expect(globalThis.SpeechRecognition).toBeDefined();
  });
});

describe('SpeechRecognition', () => {
  let recognition;
  let spyFn1;
  let spyFn2;

  beforeEach(() => {
    spyFn1 = vi.fn();
    spyFn2 = vi.fn();
    recognition = new globalThis.SpeechRecognition();
  });

  describe('.maxAlternatives', () => {
    it('should be a property of SpeechRecognition', () => {
      expect(recognition).toHaveProperty('maxAlternatives');
    });

    it('should not be called as a function', () => {
      expect(() => recognition.maxAlternatives()).toThrowError();
      expect(() => recognition.maxAlternatives(2)).toThrowError();
    });

    it('should be of type "number" when tested directly', () => {
      expect(recognition.maxAlternatives).toEqual(expect.any(Number));
    });

    it('should default to 1', () => {
      expect(recognition.maxAlternatives).toEqual(1);
    });

    it('should return the current value when called as an attribute', () => {
      expect(recognition.maxAlternatives).toEqual(1);
      recognition.maxAlternatives = 5;
      expect(recognition.maxAlternatives).toEqual(5);
    });

    it('should return any value it was assigned during assignment (even if it will not be set', () => {
      expect((recognition.maxAlternatives = 5)).toEqual(5);
      expect((recognition.maxAlternatives = 5.2)).toEqual(5.2);
      expect((recognition.maxAlternatives = 'argh')).toEqual('argh');
    });

    it('should set value to 0 when assigned anything but a number', () => {
      recognition.maxAlternatives = 5;
      expect(recognition.maxAlternatives).toEqual(5);
      recognition.maxAlternatives = 'argh';
      expect(recognition.maxAlternatives).toEqual(0);
      recognition.maxAlternatives = undefined;
      expect(recognition.maxAlternatives).toEqual(0);
    });

    it('should round down floats it receives', () => {
      recognition.maxAlternatives = 5;
      expect(recognition.maxAlternatives).toEqual(5);
      recognition.maxAlternatives = 5.1;
      expect(recognition.maxAlternatives).toEqual(5);
      recognition.maxAlternatives = 5.9;
      expect(recognition.maxAlternatives).toEqual(5);
    });
  });

  describe('.lang', () => {
    it('should be a property of SpeechRecognition', () => {
      expect(recognition).toHaveProperty('lang');
    });

    it('should default to an empty string', () => {
      expect(recognition.lang).toEqual('');
    });

    it('should return the current value when called as an attribute', () => {
      expect(recognition.lang).toEqual('');
      recognition.lang = 'en-US';
      expect(recognition.lang).toEqual('en-US');
    });

    it('should return any value it was assigned during assignment', () => {
      expect((recognition.lang = 5)).toEqual(5);
      expect((recognition.lang = 5.2)).toEqual(5.2);
      expect((recognition.lang = 'en-US')).toEqual('en-US');
    });

    it('should cast anything it is assigned to a string', () => {
      recognition.lang = 5;
      expect(recognition.lang).toEqual('5');
      recognition.lang = 5.2;
      expect(recognition.lang).toEqual('5.2');
      recognition.lang = [];
      expect(recognition.lang).toEqual('');
      recognition.lang = function shiny() {};
      expect(recognition.lang).toEqual('function shiny() {}');
      recognition.lang = {};
      expect(recognition.lang).toEqual('[object Object]');
      recognition.lang = undefined;
      expect(recognition.lang).toEqual('undefined');
      expect(recognition.lang).toEqual(expect.any(String));
    });

    it('should return the current value when called as an attribute', () => {
      expect(recognition.lang).toEqual('');
      recognition.lang = 'en-US';
      expect(recognition.lang).toEqual('en-US');
    });
  });
  describe('.continuous', () => {
    it('should be a property of SpeechRecognition', () => {
      expect(recognition).toHaveProperty('continuous');
    });

    it('should default to false', () => {
      expect(recognition.continuous).toEqual(false);
    });

    it('should return the current value when called as an attribute', () => {
      expect(recognition.continuous).toEqual(false);
      recognition.continuous = true;
      expect(recognition.continuous).toEqual(true);
    });

    it('should return any value it was assigned during assignment', () => {
      expect((recognition.continuous = 5)).toEqual(5);
      expect((recognition.continuous = 5.2)).toEqual(5.2);
      expect((recognition.continuous = true)).toEqual(true);
    });

    it('should cast anything it is assigned to a boolean', () => {
      recognition.continuous = 5;
      expect(recognition.continuous).toEqual(Boolean(5));
      recognition.continuous = 0;
      expect(recognition.continuous).toEqual(Boolean(0));
      recognition.continuous = -1;
      expect(recognition.continuous).toEqual(Boolean(-1));
      recognition.continuous = true;
      expect(recognition.continuous).toEqual(Boolean(true));
      recognition.continuous = false;
      expect(recognition.continuous).toEqual(Boolean(false));
      recognition.continuous = [];
      expect(recognition.continuous).toEqual(Boolean([]));
      recognition.continuous = undefined;
      expect(recognition.continuous).toEqual(Boolean(undefined));
    });

    it('should cause SpeechRecognition to stop after a single result when set to false', () => {
      recognition.addEventListener('end', spyFn1);
      recognition.addEventListener('result', spyFn2);
      recognition.continuous = false;
      recognition.start();
      expect(spyFn1).toBeCalledTimes(0);
      recognition.say(getSentence(0));
      recognition.say(getSentence(1));
      expect(spyFn1).toBeCalledTimes(1);
      expect(spyFn2).toBeCalledTimes(1);
    });

    it('should cause SpeechRecognition to recognize multiple consecutive results when set to true', () => {
      recognition.addEventListener('end', spyFn1);
      recognition.addEventListener('result', spyFn2);
      recognition.continuous = true;
      recognition.start();
      expect(spyFn1).toBeCalledTimes(0);
      recognition.say(getSentence(0));
      recognition.say(getSentence(1));
      expect(spyFn1).toBeCalledTimes(0);
      expect(spyFn2).toBeCalledTimes(2);
    });
  });

  describe('.interimResults', () => {
    it('should be a property of SpeechRecognition', () => {
      expect(recognition).toHaveProperty('interimResults');
    });

    it('should default to false', () => {
      expect(recognition.interimResults).toEqual(false);
    });

    it('should return the current value when called as an attribute', () => {
      expect(recognition.interimResults).toEqual(false);
      recognition.interimResults = true;
      expect(recognition.interimResults).toEqual(true);
    });

    it('should return any value it was assigned during assignment', () => {
      expect((recognition.interimResults = 5)).toEqual(5);
      expect((recognition.interimResults = 5.2)).toEqual(5.2);
      expect((recognition.interimResults = true)).toEqual(true);
    });

    it('should cast anything it is assigned to a boolean', () => {
      recognition.interimResults = 5;
      expect(recognition.interimResults).toEqual(Boolean(5));
      recognition.interimResults = 0;
      expect(recognition.interimResults).toEqual(Boolean(0));
      recognition.interimResults = -1;
      expect(recognition.interimResults).toEqual(Boolean(-1));
      recognition.interimResults = true;
      expect(recognition.interimResults).toEqual(Boolean(true));
      recognition.interimResults = false;
      expect(recognition.interimResults).toEqual(Boolean(false));
      recognition.interimResults = [];
      expect(recognition.interimResults).toEqual(Boolean([]));
      recognition.interimResults = undefined;
      expect(recognition.interimResults).toEqual(Boolean(undefined));
    });
  });
});
