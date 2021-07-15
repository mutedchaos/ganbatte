export default class CancelledError extends Error {
  constructor() {
    super('Cancelled')
  }
}
