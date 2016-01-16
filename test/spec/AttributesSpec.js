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

})();
