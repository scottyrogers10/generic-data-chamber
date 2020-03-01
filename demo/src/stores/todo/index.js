import { Store } from "../../library/dataChamber";
import types from "./types";

const store = new Store({
  name: "TODO",
  types
});

export default store;
