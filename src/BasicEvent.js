class BasicEvent {
  constructor(type) {
    this.type = type;
  }
}

export default typeof window !== 'undefined' ? Event : BasicEvent;
