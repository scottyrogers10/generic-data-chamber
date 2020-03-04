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
import userType from "./types/user";

const store = new Store({ name: "APP", plugins: [], types: { user: userType } });
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
    getById: {
      reducer: actions.getById,
      configs: { isLoading: true }
    },
    update: actions.update
  }
};
```

#### 3. Create an Action

```js
const getById = ({ plugins, prevState }, userId) => {
  return userService.getByIdAsync(userId).then(user => {
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

appStore.dispatchAsync("user.getById")(1182);
appStore.dispatch("user.update")({ firstName: "Scotty" });
```

#### 6. Get Status of Async Actions

```js
import appStore from "./stores/app";

const isLoading = appStore.isLoading("user.getById");
const isError = appStore.isError("user.getById");
const error = appStore.getError("user.getById");
```
