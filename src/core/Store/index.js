import initTypes from "./helpers/initTypes";

class Store {
  constructor({ plugins = {}, types }) {
    this.lastUid = 0;
    this.plugins = plugins;
    this.subscribers = {};
    this.types = initTypes(types);
  }

  dispatch(actionString) {
    const [typeName, actionName] = this._tokenizeAction(actionString);

    return args => {
      const type = this.types[typeName];
      const action = type.actions[actionName];

      this._setState({ typeName })(action.reducer({ plugins: this.plugins, prevState: type.state }, args));
    };
  }

  dispatchAsync(actionString) {
    const [typeName, actionName] = this._tokenizeAction(actionString);

    return args => {
      const type = this.types[typeName];
      const action = type.actions[actionName];
      const setConfigs = this._setConfigs({ actionName, typeName });
      const setState = this._setState({ typeName });
      setConfigs({ isLoading: true, isError: false, error: null });

      return Promise.resolve(action.reducer({ plugins: this.plugins, prevState: type.state }, args))
        .then(state => {
          setState(state);
          setConfigs({ isLoading: false });
          return state;
        })
        .catch(error => {
          setConfigs({ isLoading: false, isError: true, error });
          return action.configs.throwErrors && Promise.reject(error);
        });
    };
  }

  getError(actionString) {
    const [typeName, actionName] = this._tokenizeAction(actionString);
    return this.types[typeName].actions[actionName].configs.error;
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

  isError(actionString) {
    const [typeName, actionName] = this._tokenizeAction(actionString);
    return this.types[typeName].actions[actionName].configs.isError;
  }

  isLoading(actionString) {
    const [typeName, actionName] = this._tokenizeAction(actionString);
    return this.types[typeName].actions[actionName].configs.isLoading;
  }

  subscribe(onNotify = () => {}) {
    const token = `uid_${++this.lastUid}`;
    this.subscribers[token] = onNotify;

    return { onNotify, token, unsubscribe: () => this._unsubscribe(token) };
  }

  _notify() {
    Object.entries(this.subscribers).forEach(([_, onNotify]) => onNotify({ store: this }));
  }

  _setConfigs({ actionName, typeName }) {
    return configs => {
      const prevConfigs = this.types[typeName].actions[actionName].configs;
      this.types[typeName].actions[actionName].configs = { ...prevConfigs, ...configs };
      this._notify();
    };
  }

  _setState({ typeName }) {
    return state => {
      this.types[typeName].state = state;
      this._notify();
    };
  }

  _tokenizeAction(actionString) {
    return actionString.split(".");
  }

  _unsubscribe(token = null) {
    delete this.subscribers[token];
  }
}

export default Store;
