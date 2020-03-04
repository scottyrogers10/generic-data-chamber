const defaultConfigs = {
  isLoading: false,
  isError: false,
  error: null,
  shouldThrowErrors: false,
  shouldTrackAsyncState: true
};

const getActions = actions => {
  return Object.entries(actions).reduce((prevVal, [actionName, value]) => {
    const includesConfiguration = typeof value !== "function";

    prevVal[actionName] = {
      configs: includesConfiguration ? { ...defaultConfigs, ...value.configs } : defaultConfigs,
      reducer: includesConfiguration ? value.reducer : value
    };
    return prevVal;
  }, {});
};

export default (types = {}) => {
  return Object.entries(types).reduce((prevVal, [_, { actions = {}, name, state = null }]) => {
    prevVal[name] = {
      actions: getActions(actions),
      state
    };

    return prevVal;
  }, {});
};
