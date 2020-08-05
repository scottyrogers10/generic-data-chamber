import initTypes from "./helpers/initTypes";

class Store {
  constructor({ name = "", services = {}, types = {} }) {
    this.lastUid = 0;
    this.name = name;
    this.services = services;
    this.subscribers = {};
    this.types = initTypes(types);
    this._typeConfigs = types;
  }

  addType(type) {
    if (this.types[type.name]) {
      throw new Error(
        `ERROR (store.addType()): The type name "${type.name}" is already in use in the "${this.name}" store.`
      );
    } else {
      this.types = { ...this.types, ...initTypes({ type }) };
    }
  }

  dispatch(actionString, args) {
    const [typeName, actionName] = this._tokenizeAction(actionString);
    const type = this.types[typeName];
    const action = type.actions[actionName];

    this._setState({ typeName })(
      action.reducer(
        {
          prevState: type.state,
          services: this.services,
        },
        args
      )
    );
    return this.types[typeName].state;
  }

  dispatchAsync(actionString, args) {
    const [typeName, actionName] = this._tokenizeAction(actionString);
    const type = this.types[typeName];
    const action = type.actions[actionName];
    const shouldTrackAsyncState = action.configs.shouldTrackAsyncState;
    const setConfigs = this._setConfigs({ actionName, typeName });
    const setState = this._setState({ typeName });

    shouldTrackAsyncState &&
      setConfigs({ isPending: true, isError: false, error: null });

    return Promise.resolve(
      action.reducer(
        {
          prevState: type.state,
          services: this.services,
        },
        args
      )
    )
      .then((state) => {
        shouldTrackAsyncState && setConfigs({ isPending: false }, false);
        setState(state);
        return state;
      })
      .catch((error) => {
        shouldTrackAsyncState &&
          setConfigs({ isPending: false, isError: true, error });
        return !shouldTrackAsyncState
          ? Promise.reject(error)
          : action.configs.shouldThrowErrors && Promise.reject(error);
      });
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

  isPending(actionString) {
    const [typeName, actionName] = this._tokenizeAction(actionString);
    return this.types[typeName].actions[actionName].configs.isPending;
  }

  reset() {
    this.lastUid = 0;
    this.subscribers = {};
    this.types = initTypes(this._typeConfigs);
  }

  subscribe(onNotify = () => {}) {
    const token = `uid_${++this.lastUid}`;
    this.subscribers[token] = onNotify;

    onNotify(this, { typeName: null });
    return { onNotify, token, unsubscribe: () => this._unsubscribe(token) };
  }

  _notify(typeName) {
    Object.values(this.subscribers).forEach((onNotify) =>
      onNotify(this, { typeName })
    );
  }

  _setConfigs({ actionName, typeName }) {
    return (configs, shouldNotify = true) => {
      const prevConfigs = this.types[typeName].actions[actionName].configs;
      this.types[typeName].actions[actionName].configs = {
        ...prevConfigs,
        ...configs,
      };
      return shouldNotify && this._notify(typeName);
    };
  }

  _setState({ typeName }) {
    return (state, shouldNotify = true) => {
      this.types[typeName].state = state;
      return shouldNotify && this._notify(typeName);
    };
  }

  _tokenizeAction(actionString) {
    const [typeName] = actionString.split(".");
    return [typeName, actionString.slice(typeName.length + 1)];
  }

  _unsubscribe(token = null) {
    delete this.subscribers[token];
  }
}

export default Store;
