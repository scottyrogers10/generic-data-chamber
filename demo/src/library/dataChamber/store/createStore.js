import Observable from "./Observable";
import initTypes from "./initTypes";

const createStore = (storeConfigs = {}) => {
  const observable = new Observable();
  const types = initTypes(storeConfigs.types);

  return {
    getData: () => {},
    subscribe: observable.subscribe,
    update: () => {}
  };
};

export default createStore;
