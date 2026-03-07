class SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;

  constructor(transcript: string, confidence: number = 1) {
    this.transcript = transcript;
    this.confidence = confidence;
  }
}

export default SpeechRecognitionAlternative;
