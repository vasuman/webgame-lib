import EventEmitter from 'events';
import raf from 'raf';

const Tick = 'tick';
const PreTick = 'preTick';
const PostTick = 'postTick';
const Start = 'start';
const Stop = 'stop';

export default class Loop extends EventEmitter {
  constructor() {
    super();
  }

  start() {
    this._tick();
    this.emit(Start);
  }

  stop() {
    if (this.handle) {
      raf.cancel(this.handle);
    }
    this.emit(Stop);
  }

  _tick() {
    this.emit(PreTick);
    this.emit(Tick);
    this.emit(PostTick);
    this.handle = raf(() => this._tick());
  }
}
