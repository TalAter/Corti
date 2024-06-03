//! Corti - A mock implementation of the browser’s SpeechRecognition for automated testing
//! version : 1.0.0-dev
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://github.com/TalAter/Corti

import DOMException from './DOMException';

class corti {
  #maxAlternatives = 1;

  #lang = '';

  #continuous = false;

  #interimResults = false;

  #started = false;

  #soundStarted = false;

  constructor() {
    this.#started = false;
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

  isStarted() {
    return this.#started;
  }

  start() {
    if (this.#started) {
      throw new DOMException("Failed to execute 'start' on 'SpeechRecognition': recognition has already started.");
    }

    this.#started = true;

    // @TODO: Emit a start event
  }

  abort() {
    if (!this.#started) {
      return;
    }
    this.#started = false;
    this.#soundStarted = false;

    // @TODO: Emit an end event
  }

  stop() {
    // @TODO: Implement stop's behavior according to the spec. Unlike abort, stop will attempt to return a SpeechRecognitionResult using the audio captured so far.
    return this.abort();
  }
}

export default corti;
