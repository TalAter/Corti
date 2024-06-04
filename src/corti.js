//! Corti - A mock implementation of the browser’s SpeechRecognition for automated testing
//! version : 1.0.0-dev
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://github.com/TalAter/Corti

import DOMException from './DOMException';

class corti {
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
   * Indicates whether sound has started
   * @type {boolean}
   * @private
   */
  #soundStarted = false;

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
      throw new DOMException("Failed to execute 'start' on 'SpeechRecognition': recognition has already started.");
    }

    this.#started = true;

    // Emit a start event
    this.#emit('start');
  }

  /**
   * Aborts the speech recognition
   */
  abort() {
    if (!this.#started) {
      return;
    }
    this.#started = false;
    this.#soundStarted = false;
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
   * Emit an event to all registered listeners
   * @param {string} eventType The type of event to emit
   * @todo Corti will emit events in the order they were registered with addEventListener and then with the on* property. This is not the same as the Chrome implementation which will emit the listener registered with on* at the order it was registered.
   */
  #emit(eventType) {
    // Create a new event object
    let eventObject;
    if (typeof window !== 'undefined') {
      eventObject = new window.Event(eventType);
    } else {
      eventObject = { type: eventType };
    }

    // Iterate over the listeners for the given event type
    if (this.#listeners.has(eventType)) {
      this.#listeners.get(eventType).forEach(listener => listener(eventObject));
    }
    const onListener = this.#onListeners.get(`on${eventType}`);
    if (onListener) {
      onListener(eventObject);
    }
  }
}

export default corti;
