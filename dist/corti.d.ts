declare class SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
    constructor(transcript: string, confidence?: number);
}

declare class SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    [index: number]: SpeechRecognitionAlternative;
    constructor(alternatives?: SpeechRecognitionAlternative[]);
    item(index?: number | string): SpeechRecognitionAlternative | null;
    [Symbol.iterator](): Iterator<SpeechRecognitionAlternative>;
}

declare class SpeechRecognitionResultList {
    readonly length: number;
    [index: number]: SpeechRecognitionResult;
    constructor(results?: SpeechRecognitionResult[]);
    item(index?: number | string): SpeechRecognitionResult | null;
    [Symbol.iterator](): Iterator<SpeechRecognitionResult>;
}

declare class SpeechRecognitionEvent extends Event {
    readonly interpretation: null;
    readonly emma: null;
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
    constructor(type: string, { resultIndex, results }: {
        resultIndex: number;
        results: SpeechRecognitionResultList;
    });
}

type CortiEventListener = (event: Event) => void;
declare class SpeechRecognition {
    #private;
    get onstart(): CortiEventListener | null;
    set onstart(value: CortiEventListener);
    get onsoundstart(): CortiEventListener | null;
    set onsoundstart(value: CortiEventListener);
    get onend(): CortiEventListener | null;
    set onend(value: CortiEventListener);
    get onresult(): CortiEventListener | null;
    set onresult(value: CortiEventListener);
    get maxAlternatives(): number;
    set maxAlternatives(val: any);
    get lang(): string;
    set lang(val: any);
    get continuous(): boolean;
    set continuous(val: any);
    get interimResults(): boolean;
    set interimResults(val: any);
    /**
     * Checks if the recognition has started.
     * This is not part of the spec, but is used by the mock object for testing.
     */
    isStarted(): boolean;
    /**
     * Starts the speech recognition.
     * @throws {DOMException} If recognition has already started
     */
    start(): void;
    /**
     * Aborts the speech recognition.
     */
    abort(): void;
    /**
     * Stops the speech recognition and attempts to return a SpeechRecognitionResult.
     * @todo Implement stop's behavior according to the spec. Unlike abort, stop will attempt to return a SpeechRecognitionResult using the audio captured so far.
     */
    stop(): void;
    /**
     * Register an event listener for the given event type.
     */
    addEventListener(type: string, listener: CortiEventListener): void;
    /**
     * Remove an event listener for the given event type.
     * @todo Implement removeEventListener
     */
    removeEventListener(_type: string, _listener: CortiEventListener): void;
    /**
     * Simulate speech said and recognized (if SpeechRecognition is running).
     */
    say(alternatives: string | string[]): void;
}

export { SpeechRecognition, SpeechRecognitionAlternative, SpeechRecognitionEvent, SpeechRecognitionResult, SpeechRecognitionResultList };
