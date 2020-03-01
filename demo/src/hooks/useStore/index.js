import { useState, useEffect } from "react";

export default store => {
  return mapStoreToState => {
    const [state, setState] = useState(mapStoreToState(store));

    useEffect(() => {
      const subscriber = store.subscribe(({ store }) => {
        setState(mapStoreToState(store));
      });

      return subscriber.unsubscribe;
    }, []);

    return state;
  };
};
