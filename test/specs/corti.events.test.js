import { afterAll, beforeAll, beforeEach, describe, expect, it, test, vi } from 'vitest';
import { getSentence } from '../testUtils';

import { SpeechRecognition, SpeechRecognitionResultList } from '../../dist/corti';

beforeAll(() => {
  vi.stubGlobal('SpeechRecognition', SpeechRecognition);
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

test.todo('removeEventListener()');

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

  it('should support attaching just a single callback to different events', () => {
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

it('should run callbacks in the order they were registered with addEventListener followed by the on* property', () => {
  let output = '';
  recognition.onstart = () => {
    output += '1';
  };
  recognition.addEventListener('start', () => {
    output += '2';
  });
  recognition.addEventListener('start', () => {
    output += '3';
  });
  recognition.start();
  expect(output).toBe('231');
  recognition.abort();
  output = '';
  recognition.onstart = () => {
    output += '4';
  };
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

  it('should pass the event event object to the callback', () => {
    recognition.onstart = spyFn1;
    recognition.addEventListener('start', spyFn2);
    recognition.start();

    expect(spyFn1).toHaveBeenCalledWith(expect.objectContaining({ type: 'start' }));
    expect(spyFn2).toHaveBeenCalledWith(expect.objectContaining({ type: 'start' }));
  });
});

describe('end event', () => {
  it('should run each callback registered with addEventListener once per SpeechRecognition service disconnect', () => {
    recognition.addEventListener('end', spyFn1);
    recognition.addEventListener('end', spyFn2);
    recognition.start();
    expect(spyFn1).toBeCalledTimes(0);
    expect(spyFn2).toBeCalledTimes(0);
    recognition.abort();
    expect(spyFn1).toBeCalledTimes(1);
    expect(spyFn2).toBeCalledTimes(1);
    recognition.start();
    recognition.stop();
    expect(spyFn1).toBeCalledTimes(2);
    expect(spyFn2).toBeCalledTimes(2);
    recognition.stop();
    expect(spyFn1).toBeCalledTimes(2);
    expect(spyFn2).toBeCalledTimes(2);
  });

  it('should run the last callback registered with onend once per SpeechRecognition service disconnect', () => {
    recognition.onend = spyFn1;
    recognition.onend = spyFn2;
    recognition.start();
    expect(spyFn1).toBeCalledTimes(0);
    expect(spyFn2).toBeCalledTimes(0);
    recognition.abort();
    expect(spyFn1).toBeCalledTimes(0);
    expect(spyFn2).toBeCalledTimes(1);
    recognition.start();
    recognition.stop();
    expect(spyFn1).toBeCalledTimes(0);
    expect(spyFn2).toBeCalledTimes(2);
  });

  it('should pass the event object to the callback', () => {
    recognition.onend = spyFn1;
    recognition.addEventListener('end', spyFn2);
    recognition.start();
    recognition.abort();

    expect(spyFn1).toHaveBeenCalledWith(expect.objectContaining({ type: 'end' }));
    expect(spyFn2).toHaveBeenCalledWith(expect.objectContaining({ type: 'end' }));
  });
});

describe('result event', () => {
  it('should run each callback registered with addEventListener or onresult once per result returned', () => {
    recognition.addEventListener('result', spyFn1);
    recognition.onresult = spyFn2;
    recognition.continuous = true;
    recognition.start();
    expect(spyFn1).toBeCalledTimes(0);
    expect(spyFn2).toBeCalledTimes(0);
    recognition.say(getSentence(0));
    expect(spyFn1).toBeCalledTimes(1);
    expect(spyFn2).toBeCalledTimes(1);
    recognition.say(getSentence(1));
    expect(spyFn1).toBeCalledTimes(2);
    expect(spyFn2).toBeCalledTimes(2);
  });

  it('should pass the event object to the callback', () => {
    recognition.onresult = spyFn1;
    recognition.start();
    recognition.say(getSentence(0));
    expect(spyFn1).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'result',
        results: expect.any(SpeechRecognitionResultList),
        resultIndex: expect.any(Number),
      })
    );
  });
});

describe('soundstart event', () => {
  it('should run each callback registered with addEventListener or onsoundstart once per start', () => {
    recognition.addEventListener('soundstart', spyFn1);
    recognition.onsoundstart = spyFn2;
    recognition.continuous = true;
    expect(spyFn1).toBeCalledTimes(0);
    expect(spyFn2).toBeCalledTimes(0);
    recognition.start();
    expect(spyFn1).toBeCalledTimes(1);
    expect(spyFn2).toBeCalledTimes(1);
    recognition.say(getSentence(0));
    recognition.say(getSentence(1));
    expect(spyFn1).toBeCalledTimes(1);
    expect(spyFn2).toBeCalledTimes(1);
    recognition.abort();
    expect(spyFn1).toBeCalledTimes(1);
    expect(spyFn2).toBeCalledTimes(1);
    recognition.start();
    expect(spyFn1).toBeCalledTimes(2);
    expect(spyFn2).toBeCalledTimes(2);
  });
});

describe('nonexistent event', () => {
  it('should not throw an error', () => {
    expect(() => {
      recognition.addEventListener('blerg', spyFn1);
    }).not.toThrowError();
    expect(() => {
      recognition.onblerg = spyFn1;
    }).not.toThrowError();
  });
});
