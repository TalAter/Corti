class SpeechRecognitionResultList {
  constructor(results = []) {
    results.forEach((result, index) => {
      this[index] = result;
    });
    this.length = results.length;
  }

  item(index) {
    return this[index] || null;
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.length; i++) {
      yield this[i];
    }
  }
}
export default SpeechRecognitionResultList;
