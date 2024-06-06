# Corti

Corti is a drop in replacement for the browser's SpeechRecognition object. It mocks the behaviour of the native object to facilitate automated testing, and provides a number of extra methods beyond the SpeechRecognition spec to help testing (e.g., to simulate speech in automated tests).

💡 To easily use Speech Recognition in your own project, check out [annyang](https://github.com/TalAter/annyang).

## Getting Started

### Installation

Install `corti` as a dev dependency using npm:

```bash
npm install --save-dev corti
```

### Usage

#### In node.js

```javascript
// Vitest example
import corti from '../src/corti.js';
import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest';

beforeAll(() => {
  vi.stubGlobal('SpeechRecognition', corti);
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

#### In Browser
```html
<script type="module">
  import corti from 'corti.js';
  window.SpeechRecognition = corti;
  const recognition = new window.SpeechRecognition();
  recognition.onresult = () => console.log('I hear it!');
  recognition.start();
  recognition.say('Hello world');
</script>
```

For an example of how Corti is used in a real project, check out [SpeechKITT](https://github.com/TalAter/SpeechKITT).

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
