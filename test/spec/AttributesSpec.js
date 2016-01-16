(function() {
  "use strict";

  describe('SpeechRecognition.maxAlternatives', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should not be called as a function', function () {
      expect(function() {
        recognition.maxAlternatives();
      }).toThrowError();
      expect(function() {
        recognition.maxAlternatives(2);
      }).toThrowError();
    });

    it('should be of type "number" when tested directly', function () {
      expect(typeof recognition.maxAlternatives).toEqual("number");
    });

    it('should default to 1', function () {
      expect(recognition.maxAlternatives).toEqual(1);
    });

    it('should return the current value when called as an attribute', function () {
      expect(recognition.maxAlternatives).toEqual(1);
      recognition.maxAlternatives = 5;
      expect(recognition.maxAlternatives).toEqual(5);
    });

    it('should return any value it was assigned during assignment', function () {
      expect(recognition.maxAlternatives = 5).toEqual(5);
      expect(recognition.maxAlternatives = 5.2).toEqual(5.2);
      expect(recognition.maxAlternatives = 'argh').toEqual('argh');
    });

    it('should set value to 0 when assigned anything but a number', function () {
      recognition.maxAlternatives = 5;
      expect(recognition.maxAlternatives).toEqual(5);
      recognition.maxAlternatives = 'argh';
      expect(recognition.maxAlternatives).toEqual(0);
    });

    it('should round down floats it receives', function () {
      recognition.maxAlternatives = 5;
      expect(recognition.maxAlternatives).toEqual(5);
      recognition.maxAlternatives = 5.1;
      expect(recognition.maxAlternatives).toEqual(5);
      recognition.maxAlternatives = 5.9;
      expect(recognition.maxAlternatives).toEqual(5);
    });

  });

  describe('SpeechRecognition.lang', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should not be called as a function', function () {
      expect(function() {
        recognition.lang();
      }).toThrowError();
      expect(function() {
        recognition.lang(2);
      }).toThrowError();
    });

    it('should be of type "string" when tested directly', function () {
      expect(typeof recognition.lang).toEqual("string");
    });

    it('should default to an empty string', function () {
      expect(recognition.lang).toEqual('');
    });

    it('should return the current value when called as an attribute', function () {
      expect(recognition.lang).toEqual('');
      recognition.lang = 'en-US';
      expect(recognition.lang).toEqual('en-US');
    });

    it('should return any value it was assigned during assignment', function () {
      expect(recognition.lang = 5).toEqual(5);
      expect(recognition.lang = 5.2).toEqual(5.2);
      expect(recognition.lang = 'en-US').toEqual('en-US');
    });

    it('should cast anything it is assigned to a string', function () {
      recognition.lang = 5;
      expect(recognition.lang).toEqual('5');
      expect(typeof recognition.lang).toEqual("string");
      recognition.lang = 5.2;
      expect(recognition.lang).toEqual('5.2');
      expect(typeof recognition.lang).toEqual("string");
      recognition.lang = [];
      expect(recognition.lang).toEqual('');
      expect(typeof recognition.lang).toEqual("string");
      recognition.lang = function() {};
      expect(recognition.lang).toEqual('function () {}');
      expect(typeof recognition.lang).toEqual("string");
      recognition.lang = {};
      expect(recognition.lang).toEqual('[object Object]');
      expect(typeof recognition.lang).toEqual("string");
    });

  });

  describe('SpeechRecognition.continuous', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should not be called as a function', function () {
      expect(function() {
        recognition.continuous();
      }).toThrowError();
      expect(function() {
        recognition.continuous(2);
      }).toThrowError();
    });

    it('should be of type "boolean" when tested directly', function () {
      expect(typeof recognition.continuous).toEqual("boolean");
    });

    it('should default to false', function () {
      expect(recognition.continuous).toEqual(false);
    });

    it('should return the current value when called as an attribute', function () {
      expect(recognition.continuous).toEqual(false);
      recognition.continuous = true;
      expect(recognition.continuous).toEqual(true);
    });

    it('should return any value it was assigned during assignment', function () {
      expect(recognition.continuous = 5).toEqual(5);
      expect(recognition.continuous = 5.2).toEqual(5.2);
      expect(recognition.continuous = true).toEqual(true);
    });

    it('should cast anything it is assigned to a boolean', function () {
      recognition.continuous = 5;
      expect(recognition.continuous).toEqual(Boolean(5));
      recognition.continuous = 0;
      expect(recognition.continuous).toEqual(Boolean(0));
      recognition.continuous = -1;
      expect(recognition.continuous).toEqual(Boolean(-1));
      recognition.continuous = true;
      expect(recognition.continuous).toEqual(Boolean(true));
      recognition.continuous = false;
      expect(recognition.continuous).toEqual(Boolean(false));
      recognition.continuous = [];
      expect(recognition.continuous).toEqual(Boolean([]));
    });

  });

})();
