import SpeechRecognitionResultList from './SpeechRecognitionResultList';

class SpeechRecognitionEvent extends Event {
  readonly interpretation: null = null;
  readonly emma: null = null;
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;

  constructor(type: string, { resultIndex, results }: { resultIndex: number; results: SpeechRecognitionResultList }) {
    super(type);
    this.resultIndex = resultIndex;
    this.results = results;
  }
}

export default SpeechRecognitionEvent;
