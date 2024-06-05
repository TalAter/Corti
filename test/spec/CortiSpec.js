(function () {
  describe('SpeechRecognition.onsoundstart', function () {
    let spyOnSoundStart;
    let spyOnSoundStart2;
    let recognition;

    beforeEach(function () {
      spyOnSoundStart = jasmine.createSpy();
      spyOnSoundStart2 = jasmine.createSpy();
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function () {
      Corti.unpatch();
    });

    it('should attach a callback to start event which will be called once on soundstart', function () {
      recognition.onsoundstart = spyOnSoundStart;
      recognition.start();
      expect(spyOnSoundStart).not.toHaveBeenCalled();
      recognition.say('Next time you want to stab me in the back, have the guts to do it to my face');
      expect(spyOnSoundStart.calls.count()).toEqual(1);
    });

    it('should attach a callback which will be called only once until speech recognition is aborted and restarted', function () {
      recognition.continuous = true;
      recognition.onsoundstart = spyOnSoundStart;
      recognition.start();
      expect(spyOnSoundStart).not.toHaveBeenCalled();
      recognition.say('Next time you want to stab me in the back, have the guts to do it to my face');
      expect(spyOnSoundStart.calls.count()).toEqual(1);
      recognition.say("Man walks down the street in a hat like that, you know he's not afraid of anything");
      expect(spyOnSoundStart.calls.count()).toEqual(1);
      recognition.abort();
      recognition.start();
      recognition.say('Well, my time of not taking you seriously is coming to a middle');
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

  describe('SpeechRecognitionResultList (SpeechRecognitionEvent.results)', function () {
    let recognition;
    let resultsListObject;
    let event;

    beforeEach(function () {
      Corti.patch();
      recognition = new window.SpeechRecognition();
      recognition.addEventListener('result', function (ev) {
        resultsListObject = ev.results;
        event = ev;
      });
      recognition.start();
      recognition.say("You can't take the sky from me");
    });

    afterEach(function () {
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

  describe('SpeechRecognitionResultList.item', function () {
    let recognition;
    let resultsListObject;
    const sentence = "You can't take the sky from me";

    beforeEach(function () {
      Corti.patch();
      recognition = new window.SpeechRecognition();
      recognition.maxAlternatives = 5;
      recognition.addEventListener('result', function (ev) {
        resultsListObject = ev.results;
      });
      recognition.start();
      recognition.say(sentence);
    });

    afterEach(function () {
      Corti.unpatch();
      resultsListObject = undefined;
    });

    it('should throw an exception if called with no arguments', function () {
      expect(function () {
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

  describe('SpeechRecognitionResult (SpeechRecognitionEvent.results[0])', function () {
    let recognition;
    let resultObject;

    beforeEach(function () {
      Corti.patch();
      recognition = new window.SpeechRecognition();
      recognition.addEventListener('result', function (ev) {
        resultObject = ev.results[ev.resultIndex];
      });
      recognition.start();
      recognition.say("You can't take the sky from me");
    });

    afterEach(function () {
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

  describe('SpeechRecognitionResult.item', function () {
    let recognition;
    let resultObject;
    const sentence = "You can't take the sky from me";

    beforeEach(function () {
      Corti.patch();
      recognition = new window.SpeechRecognition();
      recognition.maxAlternatives = 5;
      recognition.addEventListener('result', function (ev) {
        resultObject = ev.results[ev.resultIndex];
      });
      recognition.start();
      recognition.say(sentence);
    });

    afterEach(function () {
      Corti.unpatch();
      resultObject = undefined;
    });

    it('should throw an exception if called with no arguments', function () {
      expect(function () {
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

  describe('SpeechRecognitionAlternative (SpeechRecognitionEvent.results[0][n])', function () {
    let recognition;
    let alternativeObject;

    beforeEach(function () {
      Corti.patch();
      recognition = new window.SpeechRecognition();
      recognition.addEventListener('result', function (ev) {
        alternativeObject = ev.results[ev.resultIndex][0];
      });
      recognition.start();
      recognition.say("You can't take the sky from me");
    });

    afterEach(function () {
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

  describe('SpeechRecognition.continuous', function () {
    let recognition;
    let spyOnResult;

    beforeEach(function () {
      spyOnResult = jasmine.createSpy();
      Corti.patch();
      recognition = new window.SpeechRecognition();
      recognition.onresult = spyOnResult;
    });

    afterEach(function () {
      Corti.unpatch();
    });

    it('set to false should stop SpeechRecognition after each recognition', function () {
      expect(recognition.isStarted()).toBe(false);
      recognition.continuous = false;
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
      recognition.say('Curse your sudden but inevitable betrayal');
      expect(recognition.isStarted()).toBe(false);
      expect(spyOnResult.calls.count()).toEqual(1);
    });

    it('set to true should keep SpeechRecognition running after each recognition', function () {
      expect(recognition.isStarted()).toBe(false);
      recognition.continuous = true;
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
      recognition.say('Next time you want to stab me in the back, have the guts to do it to my face');
      recognition.say("Man walks down the street in a hat like that, you know he's not afraid of anything");
      expect(recognition.isStarted()).toBe(true);
      expect(spyOnResult.calls.count()).toEqual(2);
    });
  });
})();
