export class Dispatcher {
  constructor(loop) {
    this.loop = loop;
    this.state = null;
    this.loop.on('tick', () => this._tick());
  }

  transition(nextState) {
    if (this.state) {
      this.state.teardown();
    }
    this.state = nextState;
    this.state.setup(this.loop);
  }

  _tick() {
    if (this.state) {
      let nextState = null;
      this.state.tick(next => {
        nextState = next;
      });
      if (nextState) {
        this.transition(nextState);
      }
    }
  }
}

export class State {
  setup() {}

  tick(transition) {}

  teardown() {}
}
