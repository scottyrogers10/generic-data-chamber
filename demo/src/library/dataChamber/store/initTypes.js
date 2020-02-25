const getDefaultDataByType = type => {
  const typeMap = {
    OBJECT: {},
    NULL: null,
    ARRAY: [],
    STRING: "",
    NUMBER: 0,
    BOOLEAN: false
  };

  const defaultData = typeMap[type.toLocaleUpperCase()];
  return defaultData === undefined ? null : defaultData;
};

const getDefaultData = typeConfig => {
  if (typeConfig.default === undefined) {
    return typeConfig.type !== undefined ? getDefaultDataByType(typeConfig.type) : null;
  } else {
    return typeConfig.default;
  }
};

const getInitializedUpdates = (updates = {}) => {
  return Object.keys(updates).reduce((prevVal, currentUpdateName) => {
    const update = updates[currentUpdateName];

    prevVal[currentUpdateName] = {
      ...update
    };

    return prevVal;
  }, {});
};

const initTypes = types => {
  return Object.keys(types).reduce((prevVal, currentTypeName) => {
    const typeConfig = types[currentTypeName];
    const defaultData = getDefaultData(typeConfig);

    prevVal[currentTypeName] = {
      data: defaultData,
      defaultData: defaultData,
      updates: getInitializedUpdates(typeConfig.updates)
    };

    return prevVal;
  }, {});
};

export default initTypes;
