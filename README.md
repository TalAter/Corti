# Corti
[![Build Status](https://travis-ci.org/TalAter/Corti.svg?branch=master)](https://travis-ci.org/TalAter/Corti) [![Dependency Status](https://gemnasium.com/TalAter/Corti.svg)](https://gemnasium.com/TalAter/Corti)

Corti is a drop in replacement for the browser's SpeechRecognition object. It mocks some of the behaviour of the native object to facilitate automated testing, and provides a number of extra methods beyond the spec to help testing.

For an example of using Corti to test a real project, check out [SpeechKITT](https://github.com/TalAter/SpeechKITT).

To easily use Speech Recognition in your own project, check out [annyang](https://github.com/TalAter/annyang).

### Sample Test With Corti

````javascript
Corti.patch();
var recognition = new window.SpeechRecognition();
expect(recognition.isStarted()).toBe(false);
recognition.onstart = function() {console.log('I\'m listening');};
recognition.addEventListener('end', function() {console.log('Quiet');});
recognition.start();
expect(recognition.isStarted()).toBe(true);
recognition.abort();
expect(recognition.isStarted()).toBe(false);
Corti.unpatch();
````

### Methods Currently Mocked

* start()
* abort()
* stop()
* addEventListener()

### Attributes Currently Mocked

* interimResults
* lang
* continuous
* maxAlternatives
* onstart
* onend

### Events Currently Mocked

* start
* end

### Extra Utility Methods Added To Object

* isStarted()

### Author
Tal Ater: [@TalAter](https://twitter.com/TalAter)

### License
Licensed under [MIT](https://github.com/TalAter/SpeechKITT/blob/master/LICENSE).
