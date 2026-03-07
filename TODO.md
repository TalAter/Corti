# TODO

## API Improvements

- Add missing events: `error`, `nomatch`, `audiostart`, `audioend`, `speechstart`, `speechend`
- Implement `removeEventListener` (currently a no-op)
- Implement `stop()` per spec — should attempt to return a final result, unlike `abort()`
- Add `grammars` property (passthrough for spec completeness)
- Add `simulateError(type)` testing utility to let consumers test error paths
- Drop browser test HTML files in favor of automated tests
