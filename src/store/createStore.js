const createStore = (storeConfigs = {}) => {
  const subscribers = [];

  return {
    subscribe: () => {
      console.log("SUBSCRIBE");
    },
    unsubscribe: () => {
      console.log("UNSUBSCRIBE");
    }
  };
};

export default createStore;
