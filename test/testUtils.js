const sentences = [
  "You can't take the sky from me",
  "Man walks down the street in a hat like that, you know he's not afraid of anything",
  'Next time you want to stab me in the back, have the guts to do it to my face',
  'Well, my time of not taking you seriously is coming to a middle',
  'Curse your sudden but inevitable betrayal',
];

const getLastSpiedSpeechRecognitionEvent = spy => spy.mock.calls[spy.mock.calls.length - 1][0];

const getSentence = index => sentences[index] || sentences[0];

export { getLastSpiedSpeechRecognitionEvent, getSentence };
