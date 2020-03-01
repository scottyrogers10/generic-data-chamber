import React, { useState, useEffect } from "react";
import store from "../../../stores/todo";
import styles from "./styles";

const Card = props => {
  const [user, setUser] = useState({ firstName: "", lastName: "" });

  useEffect(() => {
    const subscriber = store.subscribe(({ store }) => {
      const { firstName, lastName } = store.getState("user");
      setUser({ firstName, lastName });
    });
    return subscriber.unsubscribe;
  }, []);

  return (
    <div style={{ ...styles.container, ...props.style }}>
      <div>{user.firstName}</div>
      <div>{user.lastName}</div>
    </div>
  );
};

export default Card;
