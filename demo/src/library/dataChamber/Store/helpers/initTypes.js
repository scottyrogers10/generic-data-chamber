const getActions = actions => {
  return Object.entries(actions).reduce((prevVal, [actionName, value]) => {
    const includesConfiguration = typeof value !== "function";

    prevVal[actionName] = {
      configs: includesConfiguration ? value.configs : {},
      execute: includesConfiguration ? value.action : value
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
