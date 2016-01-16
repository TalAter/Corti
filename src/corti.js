//! Corti - Replaces the browser's SpeechRecognition with a fake object.
//! version : 0.1.0
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://github.com/TalAter/SpeechKITT/test/corti.js

(function (undefined) {
  "use strict";

  // Save a reference to the global object (window in the browser)
  var _root = this;

  // Holds the browser's implementation
  var _productionVersion = false;

  // Patch DOMException
  var DOMException = DOMException || TypeError;

  // Speech Recognition attributes
  var _maxAlternatives = 1;
  var _lang = '';
  var _continuous = false;
  var _interimResults = false;

  var newSpeechRecognition = function() {
    var _self = this;
    var _listeners = document.createElement('div');
    _self._started = false;
    _self.eventListenerTypes = ['start', 'end', 'result'];
    _self.maxAlternatives = 1;

    // Add listeners for events registered through attributes (e.g. recognition.onend = function) and not as proper listeners
    _self.eventListenerTypes.forEach(function(eventName) {
      _listeners.addEventListener(eventName, function () {
        if (typeof _self['on'+eventName] === 'function') {
          _self['on'+eventName].apply(_listeners, arguments);
        }
      }, false);
    });

    Object.defineProperty(this, 'maxAlternatives', {
      get: function() { return _maxAlternatives; },
      set: function(val) {
        if (typeof val === 'number') {
          _maxAlternatives = Math.floor(val);
        } else {
          _maxAlternatives = 0;
        }
      }
    });

    Object.defineProperty(this, 'lang', {
      get: function() { return _lang; },
      set: function(val) {
        _lang = val.toString();
      }
    });

    Object.defineProperty(this, 'continuous', {
      get: function() { return _continuous; },
      set: function(val) {
        _continuous = Boolean(val);
      }
    });

    Object.defineProperty(this, 'interimResults', {
      get: function() { return _interimResults; },
      set: function(val) {
        _interimResults = Boolean(val);
      }
    });

    this.start = function() {
      if (_self._started) {
        throw new DOMException('Failed to execute \'start\' on \'SpeechRecognition\': recognition has already started.');
      }
      _self._started = true;
      // Create and dispatch an event
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent('start', false, false, null);
      _listeners.dispatchEvent(event);
    };

    this.abort = function() {
      if (!_self._started) {
        return;
      }
      _self._started = false;
      // Create and dispatch an event
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent('end', false, false, null);
      _listeners.dispatchEvent(event);
    };

    this.stop = function() {
      return _self.abort();
    };

    this.isStarted = function() {
      return _self._started;
    };

    this.say = function(sentence) {
      // @TODO Construct a proper SpeechRecognitionEvent response
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent('result', false, false, {'sentence': sentence});
      _listeners.dispatchEvent(event);
    };

    this.addEventListener = function(event, callback) {
      _listeners.addEventListener(event, callback, false);
    };
  };

  // Expose functionality
  _root.Corti = {
    patch: function() {
      if (_productionVersion === false) {
        _productionVersion = _root.SpeechRecognition ||
          _root.webkitSpeechRecognition ||
          _root.mozSpeechRecognition ||
          _root.msSpeechRecognition ||
          _root.oSpeechRecognition;
      }
      _root.SpeechRecognition = newSpeechRecognition;
    },

    unpatch: function() {
      _root.SpeechRecognition = _productionVersion;
    }
  };

}).call(this);
