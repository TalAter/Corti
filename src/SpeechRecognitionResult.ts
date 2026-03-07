import SpeechRecognitionAlternative from './SpeechRecognitionAlternative';

class SpeechRecognitionResult {
  readonly isFinal: boolean = true;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;

  constructor(alternatives: SpeechRecognitionAlternative[] = []) {
    alternatives.forEach((alternative, index) => {
      this[index] = alternative;
    });
    this.length = alternatives.length;
  }

  item(index?: number | string): SpeechRecognitionAlternative | null {
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to execute 'item' on 'SpeechRecognitionResult': 1 argument required, but only 0 present."
      );
    }
    if (typeof index !== 'number' || Number.isNaN(index)) {
      return this[0] || null;
    }
    return this[index] || null;
  }

  *[Symbol.iterator](): Iterator<SpeechRecognitionAlternative> {
    for (let i = 0; i < this.length; i += 1) {
      yield this[i];
    }
  }
}

export default SpeechRecognitionResult;
