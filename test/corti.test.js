import { afterAll, beforeEach, beforeAll, vi, it, expect, describe } from 'vitest';

import corti from '../src/corti';

beforeAll(() => {
  vi.stubGlobal('SpeechRecognition', corti);
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
  beforeEach(() => {
    recognition = new globalThis.SpeechRecognition();
  });

  it('should return an instance of SpeechRecognition when called with new', () => {
    expect(recognition).toBeInstanceOf(globalThis.SpeechRecognition);
  });

  describe('.isStarted()', () => {
    it('should be a method', () => {
      expect(recognition.isStarted).toBeInstanceOf(Function);
    });
  });

  // describe('.say()', () => {
  //   it('should be a method', () => {
  //     expect(recognition.say).toBeInstanceOf(Function);
  //   });
  // });

  describe('.start()', () => {
    it('should be a method', () => {
      expect(recognition.start).toBeInstanceOf(Function);
    });

    it('should start SpeechRecognition', () => {
      expect(recognition.isStarted()).toBe(false);
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
    });

    it('should throw a DOMException if called on an already running SpeechRecognition object', () => {
      expect(recognition.isStarted()).toBe(false);
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
      try {
        recognition.start();
      } catch (error) {
        expect(error).toBeInstanceOf(DOMException);
        expect(error.message).toBe(
          "Failed to execute 'start' on 'SpeechRecognition': recognition has already started."
        );
      }
    });
  });

  describe('.abort()', () => {
    it('should be a method', () => {
      expect(recognition.abort).toBeInstanceOf(Function);
    });

    it('should stop SpeechRecognition', () => {
      expect(recognition.isStarted()).toBe(false);
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
      recognition.abort();
      expect(recognition.isStarted()).toBe(false);
      recognition.abort();
      expect(recognition.isStarted()).toBe(false);
    });
  });

  describe('.stop()', () => {
    it('should be a method', () => {
      expect(recognition.stop).toBeInstanceOf(Function);
    });

    it('should stop SpeechRecognition', () => {
      expect(recognition.isStarted()).toBe(false);
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
      recognition.stop();
      expect(recognition.isStarted()).toBe(false);
      recognition.stop();
      expect(recognition.isStarted()).toBe(false);
    });
  });
});
