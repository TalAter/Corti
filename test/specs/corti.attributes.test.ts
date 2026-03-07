import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getSentence } from '../testUtils';

import { SpeechRecognition } from '../../src/corti';

describe('SpeechRecognition', () => {
  let recognition: SpeechRecognition;
  let spyFn1: ReturnType<typeof vi.fn>;
  let spyFn2: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    spyFn1 = vi.fn();
    spyFn2 = vi.fn();
    recognition = new SpeechRecognition();
  });

  describe('.maxAlternatives', () => {
    it('should be a property of SpeechRecognition', () => {
      expect(recognition).toHaveProperty('maxAlternatives');
    });

    it('should not be called as a function', () => {
      expect(() => (recognition as any).maxAlternatives()).toThrowError();
      expect(() => (recognition as any).maxAlternatives(2)).toThrowError();
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
      expect((recognition.maxAlternatives = 'argh' as any)).toEqual('argh');
    });

    it('should set value to 0 when assigned anything but a number', () => {
      recognition.maxAlternatives = 5;
      expect(recognition.maxAlternatives).toEqual(5);
      recognition.maxAlternatives = 'argh' as any;
      expect(recognition.maxAlternatives).toEqual(0);
      recognition.maxAlternatives = undefined as any;
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
      expect((recognition.lang = 5 as any)).toEqual(5);
      expect((recognition.lang = 5.2 as any)).toEqual(5.2);
      expect((recognition.lang = 'en-US')).toEqual('en-US');
    });

    it('should cast anything it is assigned to a string', () => {
      recognition.lang = 5 as any;
      expect(recognition.lang).toEqual('5');
      recognition.lang = 5.2 as any;
      expect(recognition.lang).toEqual('5.2');
      recognition.lang = [] as any;
      expect(recognition.lang).toEqual('');
      const shiny = () => {};
      recognition.lang = shiny as any;
      expect(recognition.lang).toEqual(shiny.toString());
      recognition.lang = {} as any;
      expect(recognition.lang).toEqual('[object Object]');
      recognition.lang = undefined as any;
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
      expect((recognition.continuous = 5 as any)).toEqual(5);
      expect((recognition.continuous = 5.2 as any)).toEqual(5.2);
      expect((recognition.continuous = true)).toEqual(true);
    });

    it('should cast anything it is assigned to a boolean', () => {
      recognition.continuous = 5 as any;
      expect(recognition.continuous).toEqual(Boolean(5));
      recognition.continuous = 0 as any;
      expect(recognition.continuous).toEqual(Boolean(0));
      recognition.continuous = -1 as any;
      expect(recognition.continuous).toEqual(Boolean(-1));
      recognition.continuous = true;
      expect(recognition.continuous).toEqual(Boolean(true));
      recognition.continuous = false;
      expect(recognition.continuous).toEqual(Boolean(false));
      recognition.continuous = [] as any;
      expect(recognition.continuous).toEqual(Boolean([]));
      recognition.continuous = undefined as any;
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
      expect((recognition.interimResults = 5 as any)).toEqual(5);
      expect((recognition.interimResults = 5.2 as any)).toEqual(5.2);
      expect((recognition.interimResults = true)).toEqual(true);
    });

    it('should cast anything it is assigned to a boolean', () => {
      recognition.interimResults = 5 as any;
      expect(recognition.interimResults).toEqual(Boolean(5));
      recognition.interimResults = 0 as any;
      expect(recognition.interimResults).toEqual(Boolean(0));
      recognition.interimResults = -1 as any;
      expect(recognition.interimResults).toEqual(Boolean(-1));
      recognition.interimResults = true;
      expect(recognition.interimResults).toEqual(Boolean(true));
      recognition.interimResults = false;
      expect(recognition.interimResults).toEqual(Boolean(false));
      recognition.interimResults = [] as any;
      expect(recognition.interimResults).toEqual(Boolean([]));
      recognition.interimResults = undefined as any;
      expect(recognition.interimResults).toEqual(Boolean(undefined));
    });
  });
});
