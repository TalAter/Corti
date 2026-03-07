import SpeechRecognitionEvent from './SpeechRecognitionEvent';
import SpeechRecognitionResultList from './SpeechRecognitionResultList';
import SpeechRecognitionResult from './SpeechRecognitionResult';
import SpeechRecognitionAlternative from './SpeechRecognitionAlternative';

type CortiEventType = 'start' | 'soundstart' | 'end' | 'result';
type CortiEventListener = (event: Event) => void;

class SpeechRecognition {
  #maxAlternatives = 1;
  #lang = '';
  #continuous = false;
  #interimResults = false;
  #started = false;

  #listeners = new Map<CortiEventType, CortiEventListener[]>([
    ['start', []],
    ['soundstart', []],
    ['end', []],
    ['result', []],
  ]);

  // @todo Add support for other listeners defined in the spec https://dvcs.w3.org/hg/speech-api/raw-file/tip/webspeechapi#speechreco-events
  #onListeners = new Map<string, CortiEventListener | null>([
    ['onstart', null],
    ['onsoundstart', null],
    ['onend', null],
    ['onresult', null],
  ]);

  get onstart(): CortiEventListener | null {
    return this.#onListeners.get('onstart') ?? null;
  }

  set onstart(value: CortiEventListener) {
    if (typeof value === 'function') {
      this.#onListeners.set('onstart', value);
    }
  }

  get onsoundstart(): CortiEventListener | null {
    return this.#onListeners.get('onsoundstart') ?? null;
  }

  set onsoundstart(value: CortiEventListener) {
    if (typeof value === 'function') {
      this.#onListeners.set('onsoundstart', value);
    }
  }

  get onend(): CortiEventListener | null {
    return this.#onListeners.get('onend') ?? null;
  }

  set onend(value: CortiEventListener) {
    if (typeof value === 'function') {
      this.#onListeners.set('onend', value);
    }
  }

  get onresult(): CortiEventListener | null {
    return this.#onListeners.get('onresult') ?? null;
  }

  set onresult(value: CortiEventListener) {
    if (typeof value === 'function') {
      this.#onListeners.set('onresult', value);
    }
  }

  get maxAlternatives(): number {
    return this.#maxAlternatives;
  }

  set maxAlternatives(val: any) {
    if (typeof val === 'number') {
      this.#maxAlternatives = Math.floor(val);
    } else {
      this.#maxAlternatives = 0;
    }
  }

  get lang(): string {
    return this.#lang;
  }

  set lang(val: any) {
    if (val === undefined) {
      this.#lang = 'undefined';
    } else {
      this.#lang = val.toString();
    }
  }

  get continuous(): boolean {
    return this.#continuous;
  }

  set continuous(val: any) {
    this.#continuous = Boolean(val);
  }

  get interimResults(): boolean {
    return this.#interimResults;
  }

  set interimResults(val: any) {
    this.#interimResults = Boolean(val);
  }

  /**
   * Checks if the recognition has started.
   * This is not part of the spec, but is used by the mock object for testing.
   */
  isStarted(): boolean {
    return this.#started;
  }

  /**
   * Starts the speech recognition.
   * @throws {DOMException} If recognition has already started
   */
  start(): void {
    if (this.#started) {
      throw new DOMException("Failed to execute 'start' on 'SpeechRecognition': recognition has already started.");
    }

    this.#started = true;

    this.#emit('start');
    this.#emit('soundstart');
  }

  /**
   * Aborts the speech recognition.
   */
  abort(): void {
    if (!this.#started) {
      return;
    }
    this.#started = false;
    this.#emit('end');
  }

  /**
   * Stops the speech recognition and attempts to return a SpeechRecognitionResult.
   * @todo Implement stop's behavior according to the spec. Unlike abort, stop will attempt to return a SpeechRecognitionResult using the audio captured so far.
   */
  stop(): void {
    return this.abort();
  }

  /**
   * Register an event listener for the given event type.
   */
  addEventListener(type: string, listener: CortiEventListener): void {
    if (this.#listeners.has(type as CortiEventType)) {
      this.#listeners.get(type as CortiEventType)!.push(listener);
    }
  }

  /**
   * Remove an event listener for the given event type.
   * @todo Implement removeEventListener
   */
  removeEventListener(_type: string, _listener: CortiEventListener): void {}

  /**
   * Simulate speech said and recognized (if SpeechRecognition is running).
   */
  say(alternatives: string | string[]): void {
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
        if (i % 2 === 0) {
          previousPaddedSentence = `${previousPaddedSentence} and so on`;
        } else {
          previousPaddedSentence = `${previousPaddedSentence} and so forth`;
        }
        sentences.push(previousPaddedSentence);
      }
    }

    const speechRecognitionAlternatives = sentences.map((sentence, index) => {
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
   * Emit an event to all registered listeners.
   * @todo Corti will emit events in the order they were registered with addEventListener and then with the on* property. This is not the same as the Chrome implementation which will emit the listener registered with on* at the order it was registered.
   */
  #emit(eventType: CortiEventType, eventObject?: Event): void {
    const eventToEmit = eventObject || new Event(eventType);

    const listeners = this.#listeners.get(eventType);
    if (listeners) {
      listeners.forEach(listener => listener(eventToEmit));
    }
    const onListener = this.#onListeners.get(`on${eventType}`);
    if (onListener) {
      onListener(eventToEmit);
    }
  }
}

/**
 * Interface for casting a DOM SpeechRecognition instance to access Corti-specific
 * test methods (say, isStarted). Extends the DOM SpeechRecognition interface so
 * consumers can cast without going through `unknown`:
 *
 *   const sr = getSpeechRecognizer() as CortiSpeechRecognition;
 *   sr.say('hello');
 */
interface CortiSpeechRecognition extends globalThis.SpeechRecognition {
  say(alternatives: string | string[]): void;
  isStarted(): boolean;
}

export {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionResultList,
  SpeechRecognitionResult,
  SpeechRecognitionAlternative,
};
export type { CortiSpeechRecognition };
