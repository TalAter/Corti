//! Corti - A mock implementation of the browser's SpeechRecognition for automated testing
//! version : 1.0.0
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://github.com/TalAter/Corti
var corti = (function (exports) {
  'use strict';

  class BasicEvent {
    constructor(type) {
      this.type = type;
    }
  }

  var BasicEvent$1 = typeof globalThis.Event !== 'undefined' ? globalThis.Event : BasicEvent;

  const CustomDOMException = (() => {
    if (typeof globalThis.DOMException !== 'undefined') {
      return globalThis.DOMException;
    }
    return class DOMException extends Error {
      constructor(message, name) {
        super(message);
        this.name = name || 'DOMException';
      }
    };
  })();

  class SpeechRecognitionEvent extends BasicEvent$1 {
    interpretation = null;

    emma = null;

    constructor(type, { resultIndex, results }) {
      super(type);
      this.resultIndex = resultIndex;
      this.results = results;
    }
  }

  class SpeechRecognitionResultList {
    constructor(results = []) {
      results.forEach((result, index) => {
        this[index] = result;
      });
      this.length = results.length;
    }

    item(index) {
      if (arguments.length === 0) {
        throw new TypeError(
          "Failed to execute 'item' on 'SpeechRecognitionResultList': 1 argument required, but only 0 present."
        );
      }
      if (typeof index !== 'number' || Number.isNaN(index)) {
        return this[0] || null;
      }
      return this[index] || null;
    }

    *[Symbol.iterator]() {
      for (let i = 0; i < this.length; i += 1) {
        yield this[i];
      }
    }
  }

  class SpeechRecognitionResult {
    isFinal = true;

    constructor(alternatives = []) {
      alternatives.forEach((alternative, index) => {
        this[index] = alternative;
      });
      this.length = alternatives.length;
    }

    item(index) {
      if (arguments.length === 0) {
        throw new TypeError(
          "Failed to execute 'item' on 'SpeechRecognitionResult': 1 argument required, but only 0 present."
        );
      }
      if (typeof index !== 'number' || Number.isNaN(index)) {
        return this[0] || null;
      }
      return this[index] || null;
    }

    *[Symbol.iterator]() {
      for (let i = 0; i < this.length; i += 1) {
        yield this[i];
      }
    }
  }

  class SpeechRecognitionAlternative {
    constructor(transcript, confidence = 1) {
      this.transcript = transcript;
      this.confidence = confidence;
    }
  }

  class SpeechRecognition {
    /**
     * The maximum number of SpeechRecognitionAlternatives provided per SpeechRecognitionResult
     * @type {number}
     */
    #maxAlternatives = 1;

    /**
     * The language of the current SpeechRecognition
     * @type {string}
     */
    #lang = '';

    /**
     * Controls whether continuous results are returned for each recognition, or only a single result
     * @type {boolean}
     */
    #continuous = false;

    /**
     * Indicates whether interim results should be returned (true) or just the final result (false)
     * @type {boolean}
     */
    #interimResults = false;

    /**
     * Indicates whether the recognition service has started
     * @type {boolean}
     * @private
     */
    #started = false;

    /**
     * Listeners for the events registered with addEventListener
     * @type {Map<string, Function[]>}
     * @private
     * @todo Add support for other listeners defined in the spec https://dvcs.w3.org/hg/speech-api/raw-file/tip/webspeechapi#speechreco-events
     */
    #listeners = new Map([
      ['start', []],
      ['soundstart', []],
      ['end', []],
      ['result', []],
    ]);

    /**
     * Listeners for the events registered with on* methods
     * @type {Map<string, Function|null>}
     * @private
     * @todo Add support for other listeners defined in the spec https://dvcs.w3.org/hg/speech-api/raw-file/tip/webspeechapi#speechreco-events
     */
    #onListeners = new Map([
      ['onstart', null],
      ['onsoundstart', null],
      ['onend', null],
      ['onresult', null],
    ]);

    constructor() {
      // Dynamically add getters and setters for on* properties
      this.#onListeners.forEach((_, eventType) => {
        Object.defineProperty(this, eventType, {
          get: () => this.#onListeners.get(eventType),
          set: value => {
            if (typeof value === 'function') {
              this.#onListeners.set(eventType, value);
            }
          },
        });
      });
    }

    get maxAlternatives() {
      return this.#maxAlternatives;
    }

    set maxAlternatives(val) {
      if (typeof val === 'number') {
        this.#maxAlternatives = Math.floor(val);
      } else {
        this.#maxAlternatives = 0;
      }
    }

    get lang() {
      return this.#lang;
    }

    set lang(val) {
      if (val === undefined) {
        this.#lang = 'undefined';
      } else {
        this.#lang = val.toString();
      }
    }

    get continuous() {
      return this.#continuous;
    }

    set continuous(val) {
      this.#continuous = Boolean(val);
    }

    get interimResults() {
      return this.#interimResults;
    }

    set interimResults(val) {
      this.#interimResults = Boolean(val);
    }

    /**
     * Checks if the recognition has started.
     * This is not part of the spec, but is used by mock object for testing.
     * @returns {boolean}
     */
    isStarted() {
      return this.#started;
    }

    /**
     * Starts the speech recognition
     * @throws {DOMException} If recognition has already started
     */
    start() {
      if (this.#started) {
        throw new CustomDOMException("Failed to execute 'start' on 'SpeechRecognition': recognition has already started.");
      }

      this.#started = true;

      this.#emit('start');
      this.#emit('soundstart');
    }

    /**
     * Aborts the speech recognition
     */
    abort() {
      if (!this.#started) {
        return;
      }
      this.#started = false;
      this.#emit('end');
    }

    /**
     * Stops the speech recognition and attempts to return a SpeechRecognitionResult
     * @todo Implement stop's behavior according to the spec. Unlike abort, stop will attempt to return a SpeechRecognitionResult using the audio captured so far.
     */
    stop() {
      return this.abort();
    }

    /**
     * Register an event listener for the given event type
     * @param {string} type The type of event to listen for
     * @param {Function} listener The callback function to be called when the event is fired
     */
    addEventListener(type, listener) {
      if (this.#listeners.has(type)) {
        this.#listeners.get(type).push(listener);
      }
    }

    /* eslint class-methods-use-this: "off" */
    /* eslint no-unused-vars: "off" */
    /**
     * Remove an event listener for the given event type
     * @param {string} type The type of event to remove
     * @param {Function} listener The callback function to be removed
     * @todo Implement removeEventListener
     */
    removeEventListener(type, listener) {}

    /**
     * Simulate speech said and recognized (if SpeechRecognition is running)
     * @param {string|string[]} alternatives The sentence or sentences to be said
     */
    say(alternatives) {
      if (!this.#started) {
        return;
      }

      const sentences = Array.isArray(alternatives) ? alternatives : [alternatives];

      // Ensure the length of speechRecognitionAlternatives matches #maxAlternatives
      if (sentences.length > this.#maxAlternatives) {
        sentences.splice(this.#maxAlternatives);
      } else {
        const paddingNeeded = this.#maxAlternatives - sentences.length;
        let previousPaddedSentence = sentences[0];
        for (let i = 0; i < paddingNeeded; i += 1) {
          // if i is even, add "and so on" to previousPaddedSentence else add "and so forth"
          if (i % 2 === 0) {
            previousPaddedSentence = `${previousPaddedSentence} and so on`;
          } else {
            previousPaddedSentence = `${previousPaddedSentence} and so forth`;
          }
          sentences.push(previousPaddedSentence);
        }
      }

      const speechRecognitionAlternatives = sentences.map((sentence, index) => {
        // Confidence starts at 0.95 and decreases by 10% but never under 0.01
        const confidence = Math.max(0.95 * 0.9 ** index, 0.01);
        return new SpeechRecognitionAlternative(sentence, confidence);
      });

      const SREvent = new SpeechRecognitionEvent('result', {
        results: new SpeechRecognitionResultList([new SpeechRecognitionResult(speechRecognitionAlternatives)]),
        resultIndex: 0,
      });
      this.#emit('result', SREvent);

      if (!this.#continuous) {
        this.abort();
      }
    }

    /**
     * Emit an event to all registered listeners
     * @param {string} eventType The type of event to emit
     * @param {Object} eventObject The event object to emit
     * @todo Corti will emit events in the order they were registered with addEventListener and then with the on* property. This is not the same as the Chrome implementation which will emit the listener registered with on* at the order it was registered.
     */
    #emit(eventType, eventObject) {
      const eventToEmit = eventObject || new BasicEvent$1(eventType);

      // Iterate over the listeners for the given event type
      if (this.#listeners.has(eventType)) {
        this.#listeners.get(eventType).forEach(listener => listener(eventToEmit));
      }
      const onListener = this.#onListeners.get(`on${eventType}`);
      if (onListener) {
        onListener(eventToEmit);
      }
    }
  }

  exports.SpeechRecognition = SpeechRecognition;
  exports.SpeechRecognitionAlternative = SpeechRecognitionAlternative;
  exports.SpeechRecognitionEvent = SpeechRecognitionEvent;
  exports.SpeechRecognitionResult = SpeechRecognitionResult;
  exports.SpeechRecognitionResultList = SpeechRecognitionResultList;

  return exports;

})({});
//# sourceMappingURL=corti.js.map
