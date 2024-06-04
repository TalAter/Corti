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
let spyFn2;

beforeEach(() => {
  spyFn1 = vi.fn();
  spyFn2 = vi.fn();

  recognition = new globalThis.SpeechRecognition();
});

describe('SpeechRecognition.addEventListener()', () => {
  it('should be a method', () => {
    expect(recognition.addEventListener).toBeInstanceOf(Function);
  });

  it('should attach a callback to an event which will be called once per emit', () => {
    recognition.addEventListener('start', spyFn1);
    recognition.start();
    expect(spyFn1).toBeCalledTimes(1);
    expect(function shiny() {
      recognition.start();
    }).toThrowError();
    expect(spyFn1).toBeCalledTimes(1);
    recognition.abort();
    expect(spyFn1).toBeCalledTimes(1);
    recognition.start();
    expect(spyFn1).toBeCalledTimes(2);
  });

  it('should support attaching multiple callbacks to an event', () => {
    recognition.addEventListener('start', spyFn1);
    recognition.start();
    expect(spyFn1).toBeCalledTimes(1);
    expect(spyFn2).toBeCalledTimes(0);
    recognition.abort();
    expect(spyFn1).toBeCalledTimes(1);
    expect(spyFn2).toBeCalledTimes(0);
    recognition.addEventListener('start', spyFn2);
    recognition.start();
    expect(spyFn1).toBeCalledTimes(2);
    expect(spyFn2).toBeCalledTimes(1);
  });

  it('should support attaching callback to different events', () => {
    recognition.addEventListener('start', spyFn1);
    recognition.addEventListener('end', spyFn2);
    recognition.start();
    expect(spyFn1).toBeCalledTimes(1);
    expect(spyFn2).toBeCalledTimes(0);
    recognition.abort();
    expect(spyFn1).toBeCalledTimes(1);
    expect(spyFn2).toBeCalledTimes(1);
    recognition.start();
    expect(spyFn1).toBeCalledTimes(2);
    expect(spyFn2).toBeCalledTimes(1);
    recognition.stop();
    expect(spyFn1).toBeCalledTimes(2);
    expect(spyFn2).toBeCalledTimes(2);
  });

  // @TODO: Check for context in which callbacks are called
  // @TODO: Check for execution order of callbacks
});

describe('SpeechRecognition.on* event handler properties', () => {
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
    recognition.onstart = spyFn1;
    expect(recognition.onstart).toBeInstanceOf(Function);
  });

  it('should return the current value when called as an attribute', () => {
    expect(recognition.onstart).toBeNull();
    recognition.onstart = spyFn1;
    expect(recognition.onstart).toBe(spyFn1);
  });

  it('should overwrite the previous function when assigned a new one', () => {
    recognition.onstart = spyFn1;
    expect(recognition.onstart).toBe(spyFn1);
    recognition.onstart = spyFn2;
    expect(recognition.onstart).toBe(spyFn2);
  });

  it('should support attaching a single callback to different events', () => {
    recognition.onstart = spyFn1;
    recognition.onstart = spyFn2;
    expect(spyFn1).toBeCalledTimes(0);
    expect(spyFn2).toBeCalledTimes(0);
    recognition.start();
    expect(spyFn1).toBeCalledTimes(0);
    expect(spyFn2).toBeCalledTimes(1);
    recognition.abort();
    recognition.start();
    expect(spyFn1).toBeCalledTimes(0);
    expect(spyFn2).toBeCalledTimes(2);
  });
});

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

describe('start event', () => {
  it('should run each callback registered with addEventListener once per start', () => {
    recognition.addEventListener('start', spyFn1);
    recognition.start();
    expect(spyFn1).toBeCalledTimes(1);
    expect(function shiny() {
      recognition.start();
    }).toThrowError();
    expect(spyFn2).toBeCalledTimes(0);
    recognition.addEventListener('start', spyFn2);
    expect(spyFn1).toBeCalledTimes(1);
    recognition.abort();
    expect(spyFn1).toBeCalledTimes(1);
    recognition.start();
    expect(spyFn1).toBeCalledTimes(2);
    expect(spyFn2).toBeCalledTimes(1);
  });

  it('should run the last callback registered with onstart once per start', () => {
    recognition.onstart = spyFn1;
    recognition.onstart = spyFn2;
    recognition.start();
    expect(spyFn1).toBeCalledTimes(0);
    expect(spyFn2).toBeCalledTimes(1);
    recognition.abort();
    expect(spyFn1).toBeCalledTimes(0);
    expect(spyFn2).toBeCalledTimes(1);
    recognition.start();
    expect(spyFn1).toBeCalledTimes(0);
    expect(spyFn2).toBeCalledTimes(2);
  });
});
