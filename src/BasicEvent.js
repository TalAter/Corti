class BasicEvent {
  constructor(type) {
    this.type = type;
  }
}

export default typeof globalThis.Event !== 'undefined' ? globalThis.Event : BasicEvent;
