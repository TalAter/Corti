# Corti

Corti is a mock implementation of the browser’s SpeechRecognition API (aka webkitSpeechRecognition) for automated testing. It helps developers simulate speech recognition functionalities and test their applications in a controlled environment without relying on actual speech input.

💡 To easily use Speech Recognition in your own project, check out [annyang](https://github.com/TalAter/annyang).

## Features
- Mock SpeechRecognition API for testing purposes (can replace window.SpeechRecognition, window.webkitSpeechRecognition, window.mozSpeechRecognition, etc.)
- Compatible with all JavaScript testing frameworks
- Can be required (CJS), imported (ESM), or included via a script tag for testing in Node.js or in a browser
- Adds additional functionality to the SpeechRecognition API to support programmatically simulating speech and checking the current status

## Getting Started

### Installation

Install `corti` as a dev dependency using npm / pnpm / bun / yarn / etc:

```sh
npm install --save-dev corti
```

### Sample Usage

#### In node.js (ESM)

```javascript
// Vitest example
import { SpeechRecognition } from 'corti';
import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest';

beforeAll(() => {
  vi.stubGlobal('SpeechRecognition', SpeechRecognition);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe('Mirror mirror on the wall', () => {
  let recognition;
  let spyFn;

  beforeEach(() => {
    recognition = new globalThis.SpeechRecognition();
    spyFn = vi.fn();
    recognition.maxAlternatives = 5;
    recognition.onresult = spyFn;
    recognition.start();
  });

  it('should call callback when called with a single sentence', () => {
    recognition.say('Hello world');
    expect(spyFn).toHaveBeenCalled();
    const event = spyFn.mock.calls[0][0];
    expect(event.results[0][0].transcript).toBe('Hello world');
  });

  it('should call callback when called with multiple sentences', () => {
    recognition.say(['Hello world', 'How are you?']);
    expect(spyFn).toHaveBeenCalled();
    const event = spyFn.mock.calls[0][0];
    expect(event.results[0][0].transcript).toBe('Hello world');
    expect(event.results[0][1].transcript).toBe('How are you?');
  });
});
```

#### In node.js (CJS)
```javascript
// Jest example
const { SpeechRecognition } = require('corti');

beforeAll(() => {
  global.SpeechRecognition = SpeechRecognition;
});

test('SpeechRecognition', () => {
  const speech = new globalThis.SpeechRecognition();
  const spyFn = jest.fn();
  speech.onresult = spyFn;
  speech.continuous = true;
  speech.start();
  speech.say('Hello world');
  speech.say('Hello world');
  expect(spyFn.mock.calls.length).toBe(2);
});
```

#### In Browser (ESM)
```html
<script type="module">
  // Mock native SpeechRecognition
  import { SpeechRecognition } from 'corti.js';
  window.SpeechRecognition = SpeechRecognition;

  // Run some tests
  const recognition = new window.SpeechRecognition();
  recognition.onresult = () => console.log('I hear it!');
  recognition.start();
  recognition.say('Hello world');
</script>
```

#### In Browser (without modules)
```html
<script src="../dist/corti.js"></script>
<script>
  // Mock native SpeechRecognition
  window.SpeechRecognition = corti.SpeechRecognition;

  // Run some tests
  const recognition = new window.SpeechRecognition();
  recognition.onresult = () => console.log('I hear it!');
  recognition.start();
  recognition.say('Hello world');
</script>
```

For an example of how Corti is used in a real project, check out [how SpeechRecognition is mocked and tested in Corti](https://github.com/TalAter/Corti/tree/master/test/specs).

### Methods Mocked

* `start()`
* `abort()`
* `stop()`
* `addEventListener()`

### Attributes Mocked

* `interimResults`
* `lang`
* `continuous`
* `maxAlternatives`
* `onstart`
* `onend`
* `onresult`
* `onsoundstart`

### Events Mocked

* `start`
* `end`
* `result`
* `soundstart`

### Objects Mocked

* `SpeechRecognition`
* `SpeechRecognitionEvent`
* `SpeechRecognitionResultList`
* `SpeechRecognitionResult`
* `SpeechRecognitionAlternative`

### Extra Utility Methods Added To Mocked SpeechRecognition Object

* `isStarted()`
* `say()`

### Author
Tal Ater: [@TalAter](https://twitter.com/TalAter)

### License
Licensed under [MIT](https://github.com/TalAter/SpeechKITT/blob/master/LICENSE).
