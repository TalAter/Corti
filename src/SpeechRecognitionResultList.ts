import SpeechRecognitionResult from './SpeechRecognitionResult';

class SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;

  constructor(results: SpeechRecognitionResult[] = []) {
    results.forEach((result, index) => {
      this[index] = result;
    });
    this.length = results.length;
  }

  item(index?: number | string): SpeechRecognitionResult | null {
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to execute 'item' on 'SpeechRecognitionResultList': 1 argument required, but only 0 present."
      );
    }
    if (typeof index !== 'number' || Number.isNaN(index)) {
      return this[0] || null;
    }
    return this[index] || null;
  }

  *[Symbol.iterator](): Iterator<SpeechRecognitionResult> {
    for (let i = 0; i < this.length; i += 1) {
      yield this[i];
    }
  }
}

export default SpeechRecognitionResultList;
