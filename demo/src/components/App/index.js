import React from "react";
import store from "../../stores/inbox";
import styles from "./styles";

const App = props => {
  const sub = store.subscribe();
  window.store = store;
  window.sub = sub;
  return <div style={{ ...styles.container, ...props.style }}>App</div>;
};

export default App;
