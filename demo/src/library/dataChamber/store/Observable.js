class Observable {
  constructor() {
    this.nextId = 0;
    this.subscribers = {};
  }

  notify = store => {};

  subscribe = (onNotify = () => {}) => {
    const id = this.nextId;
    this.subscribers[id] = { id, onNotify };
    this.nextId += 1;

    return { id, onNotify, unsubscribe: () => this.unsubscribe(id) };
  };

  unsubscribe = (id = null) => {
    delete this.subscribers[id];
  };
}

export default Observable;
