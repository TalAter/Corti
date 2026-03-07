class SpeechRecognitionEvent extends Event {
  interpretation = null;

  emma = null;

  constructor(type, { resultIndex, results }) {
    super(type);
    this.resultIndex = resultIndex;
    this.results = results;
  }
}

export default SpeechRecognitionEvent;
