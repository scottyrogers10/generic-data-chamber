export default (prevState, userId = null) => {
  return { ...prevState, ...{ id: userId, firstName: "Scotty", lastName: "Rogers" } };
};
