import React, { useEffect } from "react";
import store from "../../stores/todo";
import { useStore } from "../../hooks";
import Input from "./Input";
import Card from "./Card";
import styles from "./styles";

const App = props => {
  const handleChange = updatedUser => store.dispatch({ action: "updateUser", type: "user" })(updatedUser);

  const user = useStore(store)(store => {
    const userState = store.getState("user");
    return { firstName: userState.firstName, lastName: userState.lastName };
  });
  useEffect(() => store.dispatch({ action: "getUserById", type: "user" })(0), []);

  return (
    <div style={{ ...styles.container, ...props.style }}>
      <Input label={"First Name"} value={user.firstName} onChange={firstName => handleChange({ firstName })} />
      <Input label={"Last Name"} value={user.lastName} onChange={lastName => handleChange({ lastName })} />
      <Card />
    </div>
  );
};

export default App;
