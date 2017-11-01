export default class {
  constructor() {
    this.events = {}
  }
  off(event) {
    delete this.events[event]
  }
  on(event, cb) {
    this.events[event] || (this.events[event] = [])
    this.events[event].push(cb)
  }
  emit(event, ...args) {
    if (!this.events[event])
      return
    for (var cb of this.events[event])
      cb(...args)
  }
}
