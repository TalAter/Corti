# Corti
[![Build Status](https://travis-ci.org/TalAter/Corti.svg?branch=master)](https://travis-ci.org/TalAter/Corti)

Corti is a drop in replacement for the browser's SpeechRecognition object. It mocks some of the behaviour of the native object to facilitate automated testing, and provides a number of extra methods beyond the spec to help testing.

For an example of using Corti to test a real project, check out [SpeechKITT](https://github.com/TalAter/SpeechKITT).

To easily use Speech Recognition in your own project, check out [annyang](https://github.com/TalAter/annyang).

### Sample Test With Corti

````javascript
// Patch the current environment with a mock Speech Recognition object
Corti.patch();

// Interact with the mock object, like you would with the real SpeechRecognition object
var recognition = new window.SpeechRecognition();
recognition.onstart = function() {console.log("I'm listening");};
recognition.addEventListener('result', function(sre) {
  console.log(sre.results.item(sre.resultIndex).item(0).transcript);
});
recognition.addEventListener('end', function() {console.log("Quiet");});
recognition.continuous = true;

// Use extra utility methods added to the mock object to assist with testing
expect(recognition.isStarted()).toBe(false);
recognition.start();
expect(recognition.isStarted()).toBe(true);
recognition.abort();
expect(recognition.isStarted()).toBe(false);

// Simulate speech recognition
recognition.addEventListener('result', mySpyFunction);
expect(mySpyFunction).not.toHaveBeenCalled();
recognition.say("Next time you want to stab me in the back, have the guts to do it to my face");
expect(mySpyFunction).toHaveBeenCalled();
````

### Methods Mocked

* start()
* abort()
* stop()
* addEventListener()

### Attributes Mocked

* interimResults
* lang
* continuous
* maxAlternatives
* onstart
* onend
* onresult

### Events Mocked

* start
* end
* result

### Event Objects Mocked

* SpeechRecognitionEvent
* SpeechRecognitionResultList
* SpeechRecognitionResult
* SpeechRecognitionAlternative

### Extra Utility Methods Added To Object

* isStarted()
* say()

### Author
Tal Ater: [@TalAter](https://twitter.com/TalAter)

### License
Licensed under [MIT](https://github.com/TalAter/SpeechKITT/blob/master/LICENSE).
