//! Corti - A mock implementation of the browser’s SpeechRecognition for automated testing
//! version : 1.0.0-dev
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://github.com/TalAter/Corti

(function (undefined) {
  // Save a reference to the global object (window in the browser)
  const _root = this; // @TODO: Consider globalThis

  // Holds the browser's implementation
  let _originalSpeechRecognition = false;

  // Patch DOMException
  var DOMException = DOMException || TypeError;

  // Speech Recognition attributes
  let _maxAlternatives = 1;
  let _lang = "";
  let _continuous = false;
  let _interimResults = false;

  const newSpeechRecognition = function () {
    const _self = this;
    const _listeners = document.createElement("div");
    _self._started = false;
    _self._soundStarted = false;
    _self.eventListenerTypes = ["start", "soundstart", "end", "result"];
    _self.maxAlternatives = 1;

    // Add listeners for events registered through attributes (e.g. recognition.onend = function) and not as proper listeners
    _self.eventListenerTypes.forEach(function (eventName) {
      _listeners.addEventListener(
        eventName,
        function () {
          if (typeof _self[`on${eventName}`] === "function") {
            _self[`on${eventName}`].apply(_listeners, arguments);
          }
        },
        false,
      );
    });

    Object.defineProperty(this, "maxAlternatives", {
      get() {
        return _maxAlternatives;
      },
      set(val) {
        if (typeof val === "number") {
          _maxAlternatives = Math.floor(val);
        } else {
          _maxAlternatives = 0;
        }
      },
    });

    Object.defineProperty(this, "lang", {
      get() {
        return _lang;
      },
      set(val) {
        if (val === undefined) {
          val = "undefined";
        }
        _lang = val.toString();
      },
    });

    Object.defineProperty(this, "continuous", {
      get() {
        return _continuous;
      },
      set(val) {
        _continuous = Boolean(val);
      },
    });

    Object.defineProperty(this, "interimResults", {
      get() {
        return _interimResults;
      },
      set(val) {
        _interimResults = Boolean(val);
      },
    });

    this.start = function () {
      if (_self._started) {
        throw new DOMException(
          "Failed to execute 'start' on 'SpeechRecognition': recognition has already started.",
        );
      }
      _self._started = true;
      // Create and dispatch an event
      const event = document.createEvent("CustomEvent");
      event.initCustomEvent("start", false, false, null);
      _listeners.dispatchEvent(event);
    };

    this.abort = function () {
      if (!_self._started) {
        return;
      }
      _self._started = false;
      _self._soundStarted = false;
      // Create and dispatch an event
      const event = document.createEvent("CustomEvent");
      event.initCustomEvent("end", false, false, null);
      _listeners.dispatchEvent(event);
    };

    this.stop = function () {
      return _self.abort();
    };

    this.isStarted = function () {
      return _self._started;
    };

    this.say = function (sentence) {
      if (!_self._started) {
        return;
      }
      // Create some speech alternatives
      const results = [];
      let commandIterator;
      let etcIterator;
      const itemFunction = function (index) {
        if (undefined === index) {
          throw new DOMException(
            "Failed to execute 'item' on 'SpeechRecognitionResult': 1 argument required, but only 0 present.",
          );
        }
        index = Number(index);
        if (isNaN(index)) {
          index = 0;
        }
        if (index >= this.length) {
          return null;
        }
        return this[index];
      };
      for (
        commandIterator = 0;
        commandIterator < _maxAlternatives;
        commandIterator++
      ) {
        let etc = "";
        for (etcIterator = 0; etcIterator < commandIterator; etcIterator++) {
          etc += " and so on";
        }
        results.push(sentence + etc);
      }

      // Create the start event
      const startEvent = document.createEvent("CustomEvent");
      startEvent.initCustomEvent("result", false, false, {
        sentence,
      }); // @TODO: Is this using deprecated functionality?
      startEvent.resultIndex = 0;
      startEvent.results = {
        item: itemFunction,
        0: {
          item: itemFunction,
          final: true, // @TODO: Should this be isFinal?
        },
      };
      for (
        commandIterator = 0;
        commandIterator < _maxAlternatives;
        commandIterator++
      ) {
        startEvent.results[0][commandIterator] = {
          transcript: results[commandIterator],
          confidence: Math.max(1 - 0.01 * commandIterator, 0.001),
        };
      }
      Object.defineProperty(startEvent.results, "length", {
        get() {
          return 1;
        },
      });
      Object.defineProperty(startEvent.results[0], "length", {
        get() {
          return _maxAlternatives;
        },
      });
      startEvent.interpretation = null;
      startEvent.emma = null;
      _listeners.dispatchEvent(startEvent);

      // Create soundstart event
      if (!_self._soundStarted) {
        _self._soundStarted = true;
        const soundStartEvent = document.createEvent("CustomEvent");
        soundStartEvent.initCustomEvent("soundstart", false, false, null);
        _listeners.dispatchEvent(soundStartEvent);
      }

      // stop if not set to continuous mode
      if (!_self.continuous) {
        _self.abort();
      }
    };

    this.addEventListener = function (event, callback) {
      _listeners.addEventListener(event, callback, false);
    };
  };

  // Expose functionality
  _root.Corti = {
    patch() {
      if (_originalSpeechRecognition === false) {
        _originalSpeechRecognition =
          _root.SpeechRecognition ||
          _root.webkitSpeechRecognition ||
          _root.mozSpeechRecognition ||
          _root.msSpeechRecognition ||
          _root.oSpeechRecognition;
      }
      _root.SpeechRecognition = newSpeechRecognition;
    },

    unpatch() {
      _root.SpeechRecognition = _originalSpeechRecognition;
    },
  };
}).call(this);
