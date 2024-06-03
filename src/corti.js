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

    // @TODO: Emit a start event
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

    // @TODO: Emit an end event
  }

  /**
   * Stops the speech recognition and attempts to return a SpeechRecognitionResult
   * @TODO Implement stop's behavior according to the spec. Unlike abort, stop will attempt to return a SpeechRecognitionResult using the audio captured so far.
   */
  stop() {
    return this.abort();
  }
}

export default corti;
