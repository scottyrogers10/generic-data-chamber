import React from "react";
import styles from "./styles";

const Input = props => {
  const handleChange = event => {
    props.onChange(event.target.value);
  };

  return (
    <div style={{ ...styles.container, ...props.style }}>
      <div>{props.label}</div>
      <input value={props.value} onChange={handleChange} />
    </div>
  );
};

Input.defaultProps = {
  value: "",
  onChange: () => {}
};

export default Input;
