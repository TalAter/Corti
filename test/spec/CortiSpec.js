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

  describe('SpeechRecognition.onsoundstart', function() {

    var spyOnSoundStart;
    var spyOnSoundStart2;
    var recognition;

    beforeEach(function() {
      spyOnSoundStart = jasmine.createSpy();
      spyOnSoundStart2 = jasmine.createSpy();
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should attach a callback to start event which will be called once on soundstart', function () {
      recognition.onsoundstart = spyOnSoundStart;
      recognition.start();
      expect(spyOnSoundStart).not.toHaveBeenCalled();
      recognition.say("Next time you want to stab me in the back, have the guts to do it to my face");
      expect(spyOnSoundStart.calls.count()).toEqual(1);
    });

    it('should attach a callback which will be called only once until speech recognition is aborted and restarted', function () {
      recognition.continuous = true;
      recognition.onsoundstart = spyOnSoundStart;
      recognition.start();
      expect(spyOnSoundStart).not.toHaveBeenCalled();
      recognition.say("Next time you want to stab me in the back, have the guts to do it to my face");
      expect(spyOnSoundStart.calls.count()).toEqual(1);
      recognition.say("Man walks down the street in a hat like that, you know he's not afraid of anything");
      expect(spyOnSoundStart.calls.count()).toEqual(1);
      recognition.abort();
      recognition.start();
      recognition.say("Well, my time of not taking you seriously is coming to a middle");
      expect(spyOnSoundStart.calls.count()).toEqual(2);
    });

    it('should overwrite previous callback attached with onsoundstart', function () {
      recognition.onsoundstart = spyOnSoundStart;
      recognition.onsoundstart = spyOnSoundStart2;
      recognition.start();
      expect(spyOnSoundStart).not.toHaveBeenCalled();
      expect(spyOnSoundStart2).not.toHaveBeenCalled();
      recognition.say("Man walks down the street in a hat like that, you know he's not afraid of anything");
      expect(spyOnSoundStart).not.toHaveBeenCalled();
      expect(spyOnSoundStart2.calls.count()).toEqual(1);
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
      recognition.continuous = true;
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

    it('should do nothing when speech recognition isn\'t started', function () {
      recognition.addEventListener('result', spyOnResult);
      recognition.start();
      expect(spyOnResult).not.toHaveBeenCalled();
      recognition.say("You can't take the sky from me");
      expect(spyOnResult.calls.count()).toEqual(1);
      recognition.abort();
      recognition.say("Well, my time of not taking you seriously is coming to a middle");
      expect(spyOnResult.calls.count()).toEqual(1);
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

  describe('SpeechRecognitionEvent', function() {

    var recognition;
    var event;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
      recognition.addEventListener('result', function(ev) {
        event = ev;
      });
      recognition.start();
      recognition.say("You can't take the sky from me");
    });

    afterEach(function() {
      Corti.unpatch();
      event = undefined;
    });

    it('should be an object', function () {
      expect(event).toEqual(jasmine.any(Object));
    });

    it('should contain a results property with a SpeechRecognitionResultList object', function () {
      expect(event.results).toEqual(jasmine.any(Object));
    });

    it('should contain a resultIndex property with the value 0', function () {
      expect(event.resultIndex).toEqual(0);
    });

    it('should contain a emma property with the value null', function () {
      expect(event.emma).toEqual(null);
    });

    it('should contain a interpretation property with the value null', function () {
      expect(event.interpretation).toEqual(null);
    });

  });

  describe('SpeechRecognitionResultList (SpeechRecognitionEvent.results)', function() {

    var recognition;
    var resultsListObject;
    var event;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
      recognition.addEventListener('result', function(ev) {
        resultsListObject = ev.results;
        event = ev;
      });
      recognition.start();
      recognition.say("You can't take the sky from me");
    });

    afterEach(function() {
      Corti.unpatch();
      resultsListObject = undefined;
    });

    it('should be an object', function () {
      expect(resultsListObject).toEqual(jasmine.any(Object));
    });

    it('should have a length attribute', function () {
      expect(resultsListObject.length).toBeDefined();
    });

    it('should have a length of 1', function () {
      expect(resultsListObject.length).toEqual(1);
    });

    it('should contain an item method', function () {
      expect(resultsListObject.item).toEqual(jasmine.any(Function));
    });

    it('should contain SpeechRecognitionResult object in index defined by resultIndex', function () {
      expect(resultsListObject[event.resultIndex]).toEqual(jasmine.any(Object));
    });

  });

  describe('SpeechRecognitionResultList.item', function() {

    var recognition;
    var resultsListObject;
    var sentence = "You can't take the sky from me";

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
      recognition.maxAlternatives = 5;
      recognition.addEventListener('result', function(ev) {
        resultsListObject = ev.results;
      });
      recognition.start();
      recognition.say(sentence);
    });

    afterEach(function() {
      Corti.unpatch();
      resultsListObject = undefined;
    });

    it('should throw an exception if called with no arguments', function () {
      expect(function() {
        resultsListObject.item();
      }).toThrowError();
    });

    it('should return a SpeechRecognitionResult when called with its index', function () {
      expect(resultsListObject.item(0)).toEqual(jasmine.any(Object));
      expect(resultsListObject.item(0).length).toEqual(5);
    });

    it('should return the first SpeechRecognitionResult when argument is NaN', function () {
      expect(resultsListObject.item('goldstar')).toEqual(jasmine.any(Object));
      expect(resultsListObject.item('goldstar').length).toEqual(5);
      expect(resultsListObject.item(NaN)).toEqual(jasmine.any(Object));
      expect(resultsListObject.item(NaN).length).toEqual(5);
    });

    it('should return null if argument is greater than or equal to the number of SpeechRecognitionResults', function () {
      expect(resultsListObject.item(99)).toEqual(null);
    });

  });

  describe('SpeechRecognitionResult (SpeechRecognitionEvent.results[0])', function() {

    var recognition;
    var resultObject;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
      recognition.addEventListener('result', function(ev) {
        resultObject = ev.results[ev.resultIndex];
      });
      recognition.start();
      recognition.say("You can't take the sky from me");
    });

    afterEach(function() {
      Corti.unpatch();
      resultObject = undefined;
    });

    it('should have a length attribute', function () {
      expect(resultObject.length).toBeDefined();
    });

    it('should have a length equal to the maxAlternatives setting', function () {
      recognition.maxAlternatives = 1;
      recognition.say("You can't take the sky from me");
      expect(resultObject.length).toEqual(1);
      recognition.maxAlternatives = 4;
      recognition.say("You can't take the sky from me");
      expect(resultObject.length).toEqual(4);
    });

    it('should contain an item method', function () {
      expect(resultObject.item).toEqual(jasmine.any(Function));
    });

    it('should contain a final attribute with a value of true', function () {
      expect(resultObject.final).toEqual(true);
    });

  });

  describe('SpeechRecognitionResult.item', function() {

    var recognition;
    var resultObject;
    var sentence = "You can't take the sky from me";

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
      recognition.maxAlternatives = 5;
      recognition.addEventListener('result', function(ev) {
        resultObject = ev.results[ev.resultIndex];
      });
      recognition.start();
      recognition.say(sentence);
    });

    afterEach(function() {
      Corti.unpatch();
      resultObject = undefined;
    });

    it('should throw an exception if called with no arguments', function () {
      expect(function() {
        resultObject.item();
      }).toThrowError();
    });

    it('should return a SpeechRecognitionAlternative when called with its index', function () {
      expect(resultObject.item(0)).toEqual(jasmine.any(Object));
      expect(resultObject.item(0).transcript).toEqual(sentence);
      expect(typeof resultObject.item(1).transcript).toEqual('string');
    });

    it('should return the first SpeechRecognitionAlternative when argument is NaN', function () {
      expect(resultObject.item('goldstar')).toEqual(jasmine.any(Object));
      expect(resultObject.item('goldstar').transcript).toEqual(sentence);
      expect(resultObject.item(NaN)).toEqual(jasmine.any(Object));
      expect(resultObject.item(NaN).transcript).toEqual(sentence);
    });

    it('should return null if argument is greater than or equal to the number of alternatives returned', function () {
      expect(resultObject.item(99)).toEqual(null);
    });

  });

  describe('SpeechRecognitionAlternative (SpeechRecognitionEvent.results[0][n])', function() {

    var recognition;
    var alternativeObject;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
      recognition.addEventListener('result', function(ev) {
        alternativeObject = ev.results[ev.resultIndex][0];
      });
      recognition.start();
      recognition.say("You can't take the sky from me");
    });

    afterEach(function() {
      Corti.unpatch();
      alternativeObject = undefined;
    });

    it('should contain a transcript attribute with a string value', function () {
      expect(typeof alternativeObject.transcript).toEqual('string');
    });

    it('should contain a confidence attribute with a number between 0 and 1', function () {
      expect(typeof alternativeObject.confidence).toEqual('number');
      expect(alternativeObject.confidence <= 1).toEqual(true);
      expect(alternativeObject.confidence >= 0).toEqual(true);
    });

  });

  describe('SpeechRecognition.continuous', function() {

    var recognition;
    var spyOnResult;

    beforeEach(function() {
      spyOnResult = jasmine.createSpy();
      Corti.patch();
      recognition = new window.SpeechRecognition();
      recognition.onresult = spyOnResult;
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('set to false should stop SpeechRecognition after each recognition', function () {
      expect(recognition.isStarted()).toBe(false);
      recognition.continuous = false;
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
      recognition.say("Curse your sudden but inevitable betrayal");
      expect(recognition.isStarted()).toBe(false);
      expect(spyOnResult.calls.count()).toEqual(1);
    });

    it('set to true should keep SpeechRecognition running after each recognition', function () {
      expect(recognition.isStarted()).toBe(false);
      recognition.continuous = true;
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
      recognition.say("Next time you want to stab me in the back, have the guts to do it to my face");
      recognition.say("Man walks down the street in a hat like that, you know he's not afraid of anything");
      expect(recognition.isStarted()).toBe(true);
      expect(spyOnResult.calls.count()).toEqual(2);
    });

  });

})();
