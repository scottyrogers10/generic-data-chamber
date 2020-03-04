import initTypes from "./helpers/initTypes";

class Store {
  constructor({ name = "", plugins = {}, types }) {
    this.lastUid = 0;
    this.name = name;
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
      const shouldTrackAsyncState = action.configs.shouldTrackAsyncState;
      const setConfigs = this._setConfigs({ actionName, typeName });
      const setState = this._setState({ typeName });

      shouldTrackAsyncState && setConfigs({ isLoading: true, isError: false, error: null });

      return Promise.resolve(action.reducer({ plugins: this.plugins, prevState: type.state }, args))
        .then(state => {
          shouldTrackAsyncState && setConfigs({ isLoading: false }, false);
          setState(state);
          return state;
        })
        .catch(error => {
          shouldTrackAsyncState && setConfigs({ isLoading: false, isError: true, error });
          return !shouldTrackAsyncState
            ? Promise.reject(error)
            : action.configs.shouldThrowErrors && Promise.reject(error);
        });
    };
  }

  getError(actionString) {
    const [typeName, actionName] = this._tokenizeAction(actionString);
    return this.types[typeName].actions[actionName].configs.error;
  }

  getState(type) {
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
    Object.entries(this.subscribers).forEach(([_, onNotify]) => onNotify(this));
  }

  _setConfigs({ actionName, typeName }) {
    return (configs, shouldNotify = true) => {
      const prevConfigs = this.types[typeName].actions[actionName].configs;
      this.types[typeName].actions[actionName].configs = { ...prevConfigs, ...configs };
      return shouldNotify && this._notify();
    };
  }

  _setState({ typeName }) {
    return (state, shouldNotify = true) => {
      this.types[typeName].state = state;
      return shouldNotify && this._notify();
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
