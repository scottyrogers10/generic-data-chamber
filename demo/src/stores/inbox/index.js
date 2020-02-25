import { createStore } from "../../library/dataChamber";
import types from "./types";

const store = createStore({
  name: "INBOX",
  types
});

export default store;
