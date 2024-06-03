const CustomDOMException = (() => {
  if (typeof globalThis.DOMException !== 'undefined') {
    return globalThis.DOMException;
  }
  return class DOMException extends Error {
    constructor(message, name) {
      super(message);
      this.name = name || 'DOMException';
    }
  };
})();

export default CustomDOMException;
