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

  describe('.addEventListener()', () => {
    it('should be a method', () => {
      expect(recognition.addEventListener).toBeInstanceOf(Function);
    });

    it('should attach a callback to an event which will be called once per emit', () => {
      const startListener = vi.fn();
      recognition.addEventListener('start', startListener);
      recognition.start();
      expect(startListener).toBeCalledTimes(1);
      expect(function shiny() {
        recognition.start();
      }).toThrowError();
      expect(startListener).toBeCalledTimes(1);
      recognition.abort();
      expect(startListener).toBeCalledTimes(1);
      recognition.start();
      expect(startListener).toBeCalledTimes(2);
    });

    it('should support attaching multiple callbacks to an event', () => {
      const startListener1 = vi.fn();
      const startListener2 = vi.fn();
      recognition.addEventListener('start', startListener1);
      recognition.start();
      expect(startListener1).toBeCalledTimes(1);
      expect(startListener2).toBeCalledTimes(0);
      recognition.abort();
      expect(startListener1).toBeCalledTimes(1);
      expect(startListener2).toBeCalledTimes(0);
      recognition.addEventListener('start', startListener2);
      recognition.start();
      expect(startListener1).toBeCalledTimes(2);
      expect(startListener2).toBeCalledTimes(1);
    });

    it('should support attaching callback to different events', () => {
      const startListener = vi.fn();
      const endListener = vi.fn();
      recognition.addEventListener('start', startListener);
      recognition.addEventListener('end', endListener);
      recognition.start();
      expect(startListener).toBeCalledTimes(1);
      expect(endListener).toBeCalledTimes(0);
      recognition.abort();
      expect(startListener).toBeCalledTimes(1);
      expect(endListener).toBeCalledTimes(1);
      recognition.start();
      expect(startListener).toBeCalledTimes(2);
      expect(endListener).toBeCalledTimes(1);
      recognition.stop();
      expect(startListener).toBeCalledTimes(2);
      expect(endListener).toBeCalledTimes(2);
    });

    // @TODO: Check for context in which callbacks are called
    // @TODO: Check for execution order of callbacks
  });

  describe('.on* event handler properties', () => {
    it('should be a property of SpeechRecognition', () => {
      expect(recognition).toHaveProperty('onstart');
      expect(recognition).toHaveProperty('onsoundstart');
      expect(recognition).toHaveProperty('onend');
      expect(recognition).toHaveProperty('onresult');
      expect(recognition).toHaveProperty('onresult');
    });

    it('should be null by default', () => {
      expect(recognition.onstart).toBeNull();
      expect(recognition.onsoundstart).toBeNull();
      expect(recognition.onend).toBeNull();
      expect(recognition.onresult).toBeNull();
    });

    it('should be of type function when assigned a function', () => {
      recognition.onstart = function shiny() {};
      expect(recognition.onstart).toBeInstanceOf(Function);
    });

    it('should return the current value when called as an attribute', () => {
      const sampleFunction = function shiny() {};
      expect(recognition.onstart).toBeNull();
      recognition.onstart = sampleFunction;
      expect(recognition.onstart).toBe(sampleFunction);
    });

    it('should overwrite the previous function when assigned a new one', () => {
      const sampleFunction1 = vi.fn();
      const sampleFunction2 = vi.fn();
      recognition.onstart = sampleFunction1;
      expect(recognition.onstart).toBe(sampleFunction1);
      recognition.onstart = sampleFunction2;
      expect(recognition.onstart).toBe(sampleFunction2);
    });

    it('should support attaching a single callback to different events', () => {
      const sampleFunction1 = vi.fn();
      const sampleFunction2 = vi.fn();
      recognition.onstart = sampleFunction1;
      recognition.onstart = sampleFunction2;
      expect(sampleFunction1).toBeCalledTimes(0);
      expect(sampleFunction2).toBeCalledTimes(0);
      recognition.start();
      expect(sampleFunction1).toBeCalledTimes(0);
      expect(sampleFunction2).toBeCalledTimes(1);
      recognition.abort();
      recognition.start();
      expect(sampleFunction1).toBeCalledTimes(0);
      expect(sampleFunction2).toBeCalledTimes(2);
    });
  });

  describe('events', () => {
    it('should run callbacks in the order they were registered with addEventListener and then with the on* property', () => {
      let output = '';
      recognition.onstart = () => (output += '1');
      recognition.addEventListener('start', () => (output += '2'));
      recognition.addEventListener('start', () => (output += '3'));
      recognition.start();
      expect(output).toBe('231');
      recognition.abort();
      output = '';
      recognition.onstart = () => (output += '4');
      recognition.start();
      expect(output).toBe('234');
    });
  });

  describe('start event', () => {
    it('should run each callback registered with addEventListener once per start', () => {
      const startListener1 = vi.fn();
      const startListener2 = vi.fn();
      recognition.addEventListener('start', startListener1);
      recognition.start();
      expect(startListener1).toBeCalledTimes(1);
      expect(function shiny() {
        recognition.start();
      }).toThrowError();
      expect(startListener2).toBeCalledTimes(0);
      recognition.addEventListener('start', startListener2);
      expect(startListener1).toBeCalledTimes(1);
      recognition.abort();
      expect(startListener1).toBeCalledTimes(1);
      recognition.start();
      expect(startListener1).toBeCalledTimes(2);
      expect(startListener2).toBeCalledTimes(1);
    });

    it('should run the last callback registered with onstart once per start', () => {
      const startListener1 = vi.fn();
      const startListener2 = vi.fn();
      recognition.onstart = startListener1;
      recognition.onstart = startListener2;
      recognition.start();
      expect(startListener1).toBeCalledTimes(0);
      expect(startListener2).toBeCalledTimes(1);
      recognition.abort();
      expect(startListener1).toBeCalledTimes(0);
      expect(startListener2).toBeCalledTimes(1);
      recognition.start();
      expect(startListener1).toBeCalledTimes(0);
      expect(startListener2).toBeCalledTimes(2);
    });
  });
});
