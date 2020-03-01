import actions from "./actions";

export default {
  name: "user",
  state: {
    id: null,
    firstName: "",
    lastName: ""
  },
  actions: {
    // getUserById: {
    //   action: actions.getUserById,
    //   configs: {}
    // }
    getUserById: actions.getUserById,
    updateUser: actions.updateUser
  }
};
