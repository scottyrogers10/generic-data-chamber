import initTypes from "./helpers/initTypes";

class Store {
  constructor({ types }) {
    this.lastUid = 0;
    this.subscribers = {};
    this.types = initTypes(types);
  }

  dispatch({ action: actionName, type: typeName }) {
    return args => {
      const type = this.types[typeName];
      const action = type.actions[actionName].execute;

      this._setState({ typeName, state: action(type.state, args) });
    };
  }

  getState(type = null) {
    if (type) {
      return this.types[type].state;
    } else {
      return Object.entries(this.types).reduce((prevVal, [type, { state }]) => {
        prevVal[type] = state;
        return prevVal;
      }, {});
    }
  }

  subscribe(onNotify = () => {}) {
    const token = `uid_${++this.lastUid}`;
    this.subscribers[token] = onNotify;

    return { onNotify, token, unsubscribe: () => this._unsubscribe(token) };
  }

  _notify() {
    Object.entries(this.subscribers).forEach(([_, onNotify]) => onNotify({ store: this }));
  }

  _setState({ typeName, state }) {
    this.types[typeName].state = state;
    this._notify();
  }

  _unsubscribe(token = null) {
    delete this.subscribers[token];
  }
}

export default Store;
