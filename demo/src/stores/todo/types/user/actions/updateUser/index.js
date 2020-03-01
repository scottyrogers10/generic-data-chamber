export default (prevVal, updatedUser) => {
  return { ...prevVal, ...updatedUser };
};
