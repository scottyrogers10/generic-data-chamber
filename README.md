# generic-data-chamber

![NPM version](https://img.shields.io/npm/v/generic-data-chamber.svg?style=flat)
![NPM license](https://img.shields.io/npm/l/generic-data-chamber.svg?style=flat)
![NPM total downloads](https://img.shields.io/npm/dt/generic-data-chamber.svg?style=flat)
![NPM monthly downloads](https://img.shields.io/npm/dm/generic-data-chamber.svg?style=flat)

A global data store that is library agnostic.

## Installation

```bash
npm install generic-data-chamber
```

## Importing

```js
import { Store } from "generic-data-chamber";
```

## Usage

#### 1. Create a Store

```js
import { Store } from "generic-data-chamber";
import userService from "./services/user";
import userType from "./types/user";

const store = new Store({
  name: "APP",
  plugins: [userService],
  types: { user: userType }
});
```

#### 2. Create a Type

```js
import actions from "./actions";

const user = {
  name: "user",
  state: {
    id: null,
    firstName: "",
    lsatName: ""
  },
  actions: {
    getByIdAsync: {
      reducer: actions.getByIdAsync,
      configs: { isPending: true }
    },
    update: actions.update
  }
};
```

#### 3. Create an Action

```js
const getByIdAsync = ({ plugins, prevState }, userId) => {
  return plugins.userService.getByIdAsync(userId).then(user => {
    return { ...prevState, ...user };
  });
};
```

#### 4. Subscribe/Unsubscribe to the Store

```js
import appStore from "./stores/app";

const subscription = appStore.subscribe(store => {
  const { firstName, lastName } = store.getState("user");
  console.log(`${firstName} ${lastName}`);
});

subscription.unsubscribe();
```

#### 5. Dispatch Actions

```js
import appStore from "./stores/app";

appStore.dispatchAsync("user.getByIdAsync", 1182);
appStore.dispatch("user.update", { firstName: "Scotty" });
```

#### 6. Get Status of Async Actions

```js
import appStore from "./stores/app";

const isPending = appStore.isPending("user.getByIdAsync");
const isError = appStore.isError("user.getByIdAsync");
const error = appStore.getError("user.getByIdAsync");
```
