import BasicEvent from './BasicEvent.js';

class SpeechRecognitionEvent extends BasicEvent {
  interpretation = null;

  emma = null;

  constructor(type, { resultIndex, results }) {
    super(type);
    this.resultIndex = resultIndex;
    this.results = results;
  }
}

export default SpeechRecognitionEvent;
