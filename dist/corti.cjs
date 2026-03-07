"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// src/corti.ts
var corti_exports = {};
__export(corti_exports, {
  SpeechRecognition: () => SpeechRecognition,
  SpeechRecognitionAlternative: () => SpeechRecognitionAlternative_default,
  SpeechRecognitionEvent: () => SpeechRecognitionEvent_default,
  SpeechRecognitionResult: () => SpeechRecognitionResult_default,
  SpeechRecognitionResultList: () => SpeechRecognitionResultList_default
});
module.exports = __toCommonJS(corti_exports);

// src/SpeechRecognitionEvent.ts
var SpeechRecognitionEvent = class extends Event {
  constructor(type, { resultIndex, results }) {
    super(type);
    this.interpretation = null;
    this.emma = null;
    this.resultIndex = resultIndex;
    this.results = results;
  }
};
var SpeechRecognitionEvent_default = SpeechRecognitionEvent;

// src/SpeechRecognitionResultList.ts
var SpeechRecognitionResultList = class {
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
    if (typeof index !== "number" || Number.isNaN(index)) {
      return this[0] || null;
    }
    return this[index] || null;
  }
  *[Symbol.iterator]() {
    for (let i = 0; i < this.length; i += 1) {
      yield this[i];
    }
  }
};
var SpeechRecognitionResultList_default = SpeechRecognitionResultList;

// src/SpeechRecognitionResult.ts
var SpeechRecognitionResult = class {
  constructor(alternatives = []) {
    this.isFinal = true;
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
    if (typeof index !== "number" || Number.isNaN(index)) {
      return this[0] || null;
    }
    return this[index] || null;
  }
  *[Symbol.iterator]() {
    for (let i = 0; i < this.length; i += 1) {
      yield this[i];
    }
  }
};
var SpeechRecognitionResult_default = SpeechRecognitionResult;

// src/SpeechRecognitionAlternative.ts
var SpeechRecognitionAlternative = class {
  constructor(transcript, confidence = 1) {
    this.transcript = transcript;
    this.confidence = confidence;
  }
};
var SpeechRecognitionAlternative_default = SpeechRecognitionAlternative;

// src/corti.ts
var _maxAlternatives, _lang, _continuous, _interimResults, _started, _listeners, _onListeners, _SpeechRecognition_instances, emit_fn;
var SpeechRecognition = class {
  constructor() {
    __privateAdd(this, _SpeechRecognition_instances);
    __privateAdd(this, _maxAlternatives, 1);
    __privateAdd(this, _lang, "");
    __privateAdd(this, _continuous, false);
    __privateAdd(this, _interimResults, false);
    __privateAdd(this, _started, false);
    __privateAdd(this, _listeners, /* @__PURE__ */ new Map([
      ["start", []],
      ["soundstart", []],
      ["end", []],
      ["result", []]
    ]));
    // @todo Add support for other listeners defined in the spec https://dvcs.w3.org/hg/speech-api/raw-file/tip/webspeechapi#speechreco-events
    __privateAdd(this, _onListeners, /* @__PURE__ */ new Map([
      ["onstart", null],
      ["onsoundstart", null],
      ["onend", null],
      ["onresult", null]
    ]));
  }
  get onstart() {
    return __privateGet(this, _onListeners).get("onstart") ?? null;
  }
  set onstart(value) {
    if (typeof value === "function") {
      __privateGet(this, _onListeners).set("onstart", value);
    }
  }
  get onsoundstart() {
    return __privateGet(this, _onListeners).get("onsoundstart") ?? null;
  }
  set onsoundstart(value) {
    if (typeof value === "function") {
      __privateGet(this, _onListeners).set("onsoundstart", value);
    }
  }
  get onend() {
    return __privateGet(this, _onListeners).get("onend") ?? null;
  }
  set onend(value) {
    if (typeof value === "function") {
      __privateGet(this, _onListeners).set("onend", value);
    }
  }
  get onresult() {
    return __privateGet(this, _onListeners).get("onresult") ?? null;
  }
  set onresult(value) {
    if (typeof value === "function") {
      __privateGet(this, _onListeners).set("onresult", value);
    }
  }
  get maxAlternatives() {
    return __privateGet(this, _maxAlternatives);
  }
  set maxAlternatives(val) {
    if (typeof val === "number") {
      __privateSet(this, _maxAlternatives, Math.floor(val));
    } else {
      __privateSet(this, _maxAlternatives, 0);
    }
  }
  get lang() {
    return __privateGet(this, _lang);
  }
  set lang(val) {
    if (val === void 0) {
      __privateSet(this, _lang, "undefined");
    } else {
      __privateSet(this, _lang, val.toString());
    }
  }
  get continuous() {
    return __privateGet(this, _continuous);
  }
  set continuous(val) {
    __privateSet(this, _continuous, Boolean(val));
  }
  get interimResults() {
    return __privateGet(this, _interimResults);
  }
  set interimResults(val) {
    __privateSet(this, _interimResults, Boolean(val));
  }
  /**
   * Checks if the recognition has started.
   * This is not part of the spec, but is used by the mock object for testing.
   */
  isStarted() {
    return __privateGet(this, _started);
  }
  /**
   * Starts the speech recognition.
   * @throws {DOMException} If recognition has already started
   */
  start() {
    if (__privateGet(this, _started)) {
      throw new DOMException("Failed to execute 'start' on 'SpeechRecognition': recognition has already started.");
    }
    __privateSet(this, _started, true);
    __privateMethod(this, _SpeechRecognition_instances, emit_fn).call(this, "start");
    __privateMethod(this, _SpeechRecognition_instances, emit_fn).call(this, "soundstart");
  }
  /**
   * Aborts the speech recognition.
   */
  abort() {
    if (!__privateGet(this, _started)) {
      return;
    }
    __privateSet(this, _started, false);
    __privateMethod(this, _SpeechRecognition_instances, emit_fn).call(this, "end");
  }
  /**
   * Stops the speech recognition and attempts to return a SpeechRecognitionResult.
   * @todo Implement stop's behavior according to the spec. Unlike abort, stop will attempt to return a SpeechRecognitionResult using the audio captured so far.
   */
  stop() {
    return this.abort();
  }
  /**
   * Register an event listener for the given event type.
   */
  addEventListener(type, listener) {
    if (__privateGet(this, _listeners).has(type)) {
      __privateGet(this, _listeners).get(type).push(listener);
    }
  }
  /**
   * Remove an event listener for the given event type.
   * @todo Implement removeEventListener
   */
  removeEventListener(_type, _listener) {
  }
  /**
   * Simulate speech said and recognized (if SpeechRecognition is running).
   */
  say(alternatives) {
    if (!__privateGet(this, _started)) {
      return;
    }
    const sentences = Array.isArray(alternatives) ? alternatives : [alternatives];
    if (sentences.length > __privateGet(this, _maxAlternatives)) {
      sentences.splice(__privateGet(this, _maxAlternatives));
    } else {
      const paddingNeeded = __privateGet(this, _maxAlternatives) - sentences.length;
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
      return new SpeechRecognitionAlternative_default(sentence, confidence);
    });
    const SREvent = new SpeechRecognitionEvent_default("result", {
      results: new SpeechRecognitionResultList_default([new SpeechRecognitionResult_default(speechRecognitionAlternatives)]),
      resultIndex: 0
    });
    __privateMethod(this, _SpeechRecognition_instances, emit_fn).call(this, "result", SREvent);
    if (!__privateGet(this, _continuous)) {
      this.abort();
    }
  }
};
_maxAlternatives = new WeakMap();
_lang = new WeakMap();
_continuous = new WeakMap();
_interimResults = new WeakMap();
_started = new WeakMap();
_listeners = new WeakMap();
_onListeners = new WeakMap();
_SpeechRecognition_instances = new WeakSet();
/**
 * Emit an event to all registered listeners.
 * @todo Corti will emit events in the order they were registered with addEventListener and then with the on* property. This is not the same as the Chrome implementation which will emit the listener registered with on* at the order it was registered.
 */
emit_fn = function(eventType, eventObject) {
  const eventToEmit = eventObject || new Event(eventType);
  const listeners = __privateGet(this, _listeners).get(eventType);
  if (listeners) {
    listeners.forEach((listener) => listener(eventToEmit));
  }
  const onListener = __privateGet(this, _onListeners).get(`on${eventType}`);
  if (onListener) {
    onListener(eventToEmit);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SpeechRecognition,
  SpeechRecognitionAlternative,
  SpeechRecognitionEvent,
  SpeechRecognitionResult,
  SpeechRecognitionResultList
});
//# sourceMappingURL=corti.cjs.map