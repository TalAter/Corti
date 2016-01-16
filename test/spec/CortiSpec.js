(function() {
  "use strict";

  describe('Corti', function() {

    it('should exist in global namespace', function () {
      expect(Corti).toEqual(jasmine.any(Object));
    });

    it('should contain patch method', function () {
      expect(Corti.patch).toEqual(jasmine.any(Function));
    });

    it('should contain unpatch method', function () {
      expect(Corti.unpatch).toEqual(jasmine.any(Function));
    });

  });

  describe('Corti.patch', function() {

    it('should make SpeechRecognition defined', function () {
      expect(window.SpeechRecognition).toBeUndefined();
      Corti.patch();
      expect(window.SpeechRecognition).toBeDefined();
      Corti.unpatch();
    });

  });

  describe('Corti.unpatch', function() {

    it('should make SpeechRecognition undefined', function () {
      expect(window.SpeechRecognition).toBeUndefined();
      Corti.patch();
      expect(window.SpeechRecognition).toBeDefined();
      Corti.unpatch();
      expect(window.SpeechRecognition).toBeUndefined();
    });

  });

  describe('new SpeechRecognition', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should contain the method isStarted', function () {
      expect(recognition.isStarted).toEqual(jasmine.any(Function));
    });

    it('should contain the method say', function () {
      expect(recognition.say).toEqual(jasmine.any(Function));
    });

    it('should contain the method start', function () {
      expect(recognition.start).toEqual(jasmine.any(Function));
    });

    it('should contain the method abort', function () {
      expect(recognition.abort).toEqual(jasmine.any(Function));
    });

    it('should contain the method stop', function () {
      expect(recognition.stop).toEqual(jasmine.any(Function));
    });

    it('should contain the method addEventListener', function () {
      expect(recognition.addEventListener).toEqual(jasmine.any(Function));
    });

  });

  describe('SpeechRecognition.start', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should start SpeechRecognition', function () {
      expect(recognition.isStarted()).toBe(false);
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
    });

    it('should throw an exception if called on an already running SpeechRecognition object', function () {
      expect(recognition.isStarted()).toBe(false);
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
      expect(function() {
        recognition.start();
      }).toThrowError();
    });

  });

  describe('SpeechRecognition.abort', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should stop SpeechRecognition', function () {
      expect(recognition.isStarted()).toBe(false);
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
      recognition.abort();
      expect(recognition.isStarted()).toBe(false);
      recognition.abort();
      expect(recognition.isStarted()).toBe(false);
    });

  });

  describe('SpeechRecognition.stop', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should stop SpeechRecognition', function () {
      expect(recognition.isStarted()).toBe(false);
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
      recognition.stop();
      expect(recognition.isStarted()).toBe(false);
      recognition.stop();
      expect(recognition.isStarted()).toBe(false);
    });

  });

  describe('SpeechRecognition.onstart', function() {

    var spyOnStart;
    var spyOnStart2;
    var recognition;

    beforeEach(function() {
      spyOnStart = jasmine.createSpy();
      spyOnStart2 = jasmine.createSpy();
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should attach a callback to start event which will be called once on start', function () {
      expect(spyOnStart).not.toHaveBeenCalled();
      recognition.onstart = spyOnStart;
      recognition.start();
      expect(spyOnStart.calls.count()).toEqual(1);
      expect(function() {
        recognition.start();
      }).toThrowError();
      expect(spyOnStart.calls.count()).toEqual(1);
      recognition.abort();
      expect(spyOnStart.calls.count()).toEqual(1);
    });

    it('should overwrite previous callback attached with onstart', function () {
      expect(spyOnStart).not.toHaveBeenCalled();
      expect(spyOnStart2).not.toHaveBeenCalled();
      recognition.onstart = spyOnStart;
      recognition.onstart = spyOnStart2;
      recognition.start();
      expect(spyOnStart).not.toHaveBeenCalled();
      expect(spyOnStart2.calls.count()).toEqual(1);
    });

  });

  describe('SpeechRecognition.onend', function() {

    var spyOnEnd;
    var spyOnEnd2;
    var recognition;

    beforeEach(function() {
      spyOnEnd = jasmine.createSpy();
      spyOnEnd2 = jasmine.createSpy();
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should attach a callback to end event which will be called once on stop', function () {
      recognition.onend = spyOnEnd;
      recognition.start();
      expect(spyOnEnd).not.toHaveBeenCalled();
      recognition.abort();
      expect(spyOnEnd.calls.count()).toEqual(1);
      recognition.abort();
      expect(spyOnEnd.calls.count()).toEqual(1);
    });

    it('should attach a callback to end event which will be called once on abort', function () {
      recognition.onend = spyOnEnd;
      recognition.start();
      expect(spyOnEnd).not.toHaveBeenCalled();
      recognition.stop();
      expect(spyOnEnd.calls.count()).toEqual(1);
      recognition.stop();
      expect(spyOnEnd.calls.count()).toEqual(1);
    });

    it('should overwrite previous callback attached with onend', function () {
      expect(spyOnEnd).not.toHaveBeenCalled();
      expect(spyOnEnd2).not.toHaveBeenCalled();
      recognition.onend = spyOnEnd;
      recognition.onend = spyOnEnd2;
      recognition.start();
      recognition.abort();
      expect(spyOnEnd).not.toHaveBeenCalled();
      expect(spyOnEnd2.calls.count()).toEqual(1);
    });

  });

  describe('SpeechRecognition.onresult', function() {

    var spyOnResult;
    var spyOnResult2;
    var recognition;

    beforeEach(function() {
      spyOnResult = jasmine.createSpy();
      spyOnResult2 = jasmine.createSpy();
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should attach a callback to result event which will be called once when the speech recognizer returns a result', function () {
      recognition.onresult = spyOnResult;
      recognition.start();
      expect(spyOnResult).not.toHaveBeenCalled();
      recognition.say("Next time you want to stab me in the back, have the guts to do it to my face");
      expect(spyOnResult.calls.count()).toEqual(1);
      recognition.say("Man walks down the street in a hat like that, you know he's not afraid of anything");
      expect(spyOnResult.calls.count()).toEqual(2);
    });

    it('should overwrite previous callback attached with onresult', function () {
      recognition.onresult = spyOnResult;
      recognition.onresult = spyOnResult2;
      recognition.start();
      expect(spyOnResult).not.toHaveBeenCalled();
      recognition.say("Curse your sudden but inevitable betrayal");
      expect(spyOnResult).not.toHaveBeenCalled();
      expect(spyOnResult2.calls.count()).toEqual(1);
    });

  });

  describe('SpeechRecognition.addEventListener("start")', function() {

    var spyOnStart;
    var spyOnStart2;
    var recognition;

    beforeEach(function() {
      spyOnStart = jasmine.createSpy();
      spyOnStart2 = jasmine.createSpy();
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should attach a callback to start event which will be called once on start', function () {
      expect(spyOnStart).not.toHaveBeenCalled();
      recognition.addEventListener('start', spyOnStart);
      recognition.start();
      expect(spyOnStart.calls.count()).toEqual(1);
      expect(function() {
        recognition.start();
      }).toThrowError();
      expect(spyOnStart.calls.count()).toEqual(1);
      recognition.abort();
      expect(spyOnStart.calls.count()).toEqual(1);
    });

    it('can attach multiple callbacks and all will respond to an event', function () {
      expect(spyOnStart).not.toHaveBeenCalled();
      expect(spyOnStart2).not.toHaveBeenCalled();
      recognition.addEventListener('start', spyOnStart);
      recognition.addEventListener('start', spyOnStart2);
      recognition.start();
      expect(spyOnStart.calls.count()).toEqual(1);
      expect(spyOnStart2.calls.count()).toEqual(1);
    });

  });

  describe('SpeechRecognition.addEventListener("end")', function() {

    var spyOnEnd;
    var recognition;

    beforeEach(function() {
      spyOnEnd = jasmine.createSpy();
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should attach a callback to end event which will be called once on abort', function () {
      recognition.addEventListener('end', spyOnEnd);
      recognition.start();
      expect(spyOnEnd).not.toHaveBeenCalled();
      recognition.abort();
      expect(spyOnEnd.calls.count()).toEqual(1);
      recognition.abort();
      expect(spyOnEnd.calls.count()).toEqual(1);
    });

    it('should attach a callback to end event which will be called once on stop', function () {
      recognition.addEventListener('end', spyOnEnd);
      recognition.start();
      expect(spyOnEnd).not.toHaveBeenCalled();
      recognition.stop();
      expect(spyOnEnd.calls.count()).toEqual(1);
      recognition.stop();
      expect(spyOnEnd.calls.count()).toEqual(1);
    });

  });

  describe('SpeechRecognition.addEventListener("result")', function() {

    var spyOnResult;
    var recognition;

    beforeEach(function() {
      spyOnResult = jasmine.createSpy();
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should attach a callback to result event which will be called once when the speech recognizer returns a result', function () {
      recognition.addEventListener('result', spyOnResult);
      recognition.start();
      expect(spyOnResult).not.toHaveBeenCalled();
      recognition.say("You can't take the sky from me");
      expect(spyOnResult.calls.count()).toEqual(1);
      recognition.say("Well, my time of not taking you seriously is coming to a middle");
      expect(spyOnResult.calls.count()).toEqual(2);
    });

  });

  describe('SpeechRecognition.addEventListener("blerg")', function() {

    var spyOnBlerg;
    var recognition;

    beforeEach(function() {
      spyOnBlerg = jasmine.createSpy();
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should not attach a callback to end or start events', function () {
      expect(spyOnBlerg).not.toHaveBeenCalled();
      recognition.addEventListener('blerg', spyOnBlerg);
      recognition.start();
      recognition.abort();
      recognition.abort();
      expect(spyOnBlerg).not.toHaveBeenCalled();
    });

  });

  describe('SpeechRecognition.say', function() {

    var spyOnResult;
    var recognition;

    beforeEach(function() {
      spyOnResult = jasmine.createSpy();
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should fire the result event once', function () {
      recognition.addEventListener('result', spyOnResult);
      recognition.start();
      expect(spyOnResult).not.toHaveBeenCalled();
      recognition.say("You can't take the sky from me");
      expect(spyOnResult.calls.count()).toEqual(1);
      recognition.say("Well, my time of not taking you seriously is coming to a middle");
      expect(spyOnResult.calls.count()).toEqual(2);
    });

  });

  describe('start event', function() {

    var recognition;
    var event;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
      event = undefined;
    });

    it('should be returned when using addEventListener', function () {
      recognition.addEventListener('start', function(ev) {
        event = ev;
      });
      recognition.start();
      expect(event).toEqual(jasmine.any(Object));
    });

    it('should be returned when using onstart attribute', function () {
      recognition.onstart = function(ev) {
        event = ev;
      };
      recognition.start();
      expect(event).toEqual(jasmine.any(Object));
    });

    it('should not persist after creating a new SpeechRecognition object', function () {
      recognition.start();
      expect(event).toEqual(undefined);
    });

  });

  describe('end event', function() {

    var recognition;
    var event;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
      event = undefined;
    });

    it('should be returned when using addEventListener', function () {
      recognition.addEventListener('end', function(ev) {
        event = ev;
      });
      recognition.start();
      recognition.abort();
      expect(event).toEqual(jasmine.any(Object));
    });

    it('should be returned when using onend attribute', function () {
      recognition.onend = function(ev) {
        event = ev;
      };
      recognition.start();
      recognition.abort();
      expect(event).toEqual(jasmine.any(Object));
    });

    it('should not persist after creating a new SpeechRecognition object', function () {
      recognition.start();
      recognition.abort();
      expect(event).toEqual(undefined);
    });

  });

})();
