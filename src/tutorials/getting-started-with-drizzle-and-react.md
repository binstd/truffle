Drizzle is the newest member of the Truffle Suite and our first front-end development tool. At its core, **Drizzle** takes care of synchronizing your contract data, transaction data and more from the blockchain to a Redux store. There are also higher-level abstractions on top of the base `drizzle` library; tools for React compatibility ([`drizzle-react`](/docs/drizzle/react/react-integration)) and a set of ready-to-use React components ([`drizzle-react-components`](/docs/drizzle/react/react-components)).

We're going to focus on the lower levels today, taking you through setting up a Truffle project with React and Drizzle from scratch. This way we can gain the best understanding of how Drizzle works under the hood. With this knowledge, you can leverage the full power of Drizzle with any front-end framework of your choosing, or use the higher-level React abstractions with confidence.

This will be a very minimal tutorial focused on setting and getting a simple string stored in a contract. It's meant for those with a basic knowledge of Truffle, who have some knowledge of JavaScript and React.js, but who are new to using Drizzle.

<p class="alert alert-info">
<strong>Note</strong>: For Truffle basics, please read through the Truffle [Pet Shop](/tutorials/pet-shop) tutorial before proceeding.
</p>

In this tutorial we will be covering:

1. Setting up the development environment
2. Creating a Truffle project from scratch
3. Writing the smart contract
4. Compiling and migrating the smart contract
5. Testing the smart contract
6. Creating our React.js project
7. Setting up the front-end client
8. Wire up the React app with Drizzle
9. Write a component to read from Drizzle
10. Write a component to write to the smart contract

## Setting up the development environment

There are a few technical requirements before we start. Please install the following:

*   [Node.js v8+ LTS and npm](https://nodejs.org/en/) (comes with Node)
*   [Git](https://git-scm.com/)

### Truffle

Once we have those installed, we only need one command to install Truffle:

```shell
npm install -g truffle
```

To verify that Truffle is installed properly, type `truffle version` on a terminal. If you see an error, make sure that your npm modules are added to your path.

### Ganache-CLI

We also will be using [Ganache-CLI](https://github.com/trufflesuite/ganache-cli), a personal blockchain for Ethereum development you can use to deploy contracts, develop applications, and run tests on. You can install it globally with this command:

```shell
npm install -g ganache-cli
```

### Create-React-App

Finally, since this is a React.js tutorial, we will be creating our React project with [Create-React-App](https://github.com/facebook/create-react-app/).

You won't have to do anything if you have NPM version 5.2 or above. You can check your NPM version by running `npm --version`. If you do not, then you will need to install the tool globally with this command:

```shell
npm install -g create-react-app
```

## Creating a Truffle project

1. Truffle initializes in the current directory, so first create a directory in your development folder of choice and then move inside it.

   ```shell
   mkdir drizzle-react-tutorial
   cd drizzle-react-tutorial
   ```

2. Now we're ready to spawn our empty Truffle project by running the following command:

   ```shell
   truffle init
   ```

Let's take a brief look at the directory structure that was just generated.

### Directory structure

The default Truffle directory structure contains the following:

* `contracts/`: Contains the [Solidity](https://solidity.readthedocs.io/) source files for our smart contracts. There is an important contract in here called `Migrations.sol`, which we'll talk about later.
* `migrations/`: Truffle uses a migration system to handle smart contract deployments. A migration is an additional special smart contract that keeps track of changes.
* `test/`: Contains both JavaScript and Solidity tests for our smart contracts
* `truffle-config.js`: Truffle configuration file
* `truffle.js`: Another Truffle configuration file (soon to be deprecated)

## Writing our smart contract

We'll add a simple smart contract called MyStringStore.

1. Create a new file named `MyStringStore.sol` in the `contracts/` directory.

2. Add the following content to the file:

   ```javascript
   pragma solidity ^0.4.24;

   contract MyStringStore {
     string public myString = "Hello World";

     function set(string x) public {
       myString = x;
     }
   }
   ```

Since this isn't a Solidity tutorial, all you need to know about this is:

* We've created a public string variable named `myString` and initialized it to "Hello World". This automatically creates a getter (since it's a public variable) so we don't have to write one ourselves.
* We've created a setter method that simply sets the `myString` variable with whatever string is passed in.

## Launching a test blockchain

Before we move ahead, let's first launch our test blockchain with Ganache-CLI. 

Open up a new terminal and run the following command:

```shell
ganache-cli -b 3
```

This will spawn a new blockchain that listens on `127.0.0.1:8545` by default and will mine every 3 seconds. If we didn't specify this, Ganache would mine instantly and we won't be able to simulate the delay it takes for the real blockchain to mine.

Leave the terminal window open, you can observe what happens as you interact with it later on.

### Specify the network

We need to let our Truffle project know how to connect to this blockchain. To do that, we need to put the following inside `truffle.js` (or `truffle-config.js` if you are on Windows):

```javascript
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
```

## Compiling and migrating the smart contract

Now we are ready to compile and migrate our contract.

### Compilation

1. In a terminal, make sure you are in the root of the project directory and type:

   ```shell
   truffle compile
   ```

   <p class="alert alert-info">
   <strong>Note</strong>: If you're on Windows and encountering problems running this command, please see the documentation on [resolving naming conflicts on Windows](/docs/advanced/configuration#resolving-naming-conflicts-on-windows).
   </p>

   You should see output similar to the following:

   ```shell
   Compiling ./contracts/Migrations.sol...
   Compiling ./contracts/MyStringStore.sol...
   Writing artifacts to ./build/contracts
   ```

### Migration

Now that we've successfully compiled our contracts, it's time to migrate them to the blockchain!

<p class="alert alert-info">
  <strong>Note</strong>: Read more about migrations in the [Truffle documentation](/docs/getting_started/migrations).
</p>

To create our own migration script.

1. Create a new file named `2_deploy_contracts.js` in the `migrations/` directory.

2. Add the following content to the `2_deploy_contracts.js` file:

   ```javascript
   const MyStringStore = artifacts.require("MyStringStore");

   module.exports = function(deployer) {
     deployer.deploy(MyStringStore);
   };
   ```

3. Back in our terminal, migrate the contract to the blockchain.

   ```shell
   truffle migrate
   ```

   You should see output similar to the following:

   ```shell
   Using network 'development'.

   Running migration: 1_initial_migration.js
     Deploying Migrations...
     ... 0xcc1a5aea7c0a8257ba3ae366b83af2d257d73a5772e84393b0576065bf24aedf
     Migrations: 0x8cdaf0cd259887258bc13a92c0a6da92698644c0
   Saving successful migration to network...
     ... 0xd7bc86d31bee32fa3988f1c1eabce403a1b5d570340a3a9cdba53a472ee8c956
   Saving artifacts...
   Running migration: 2_deploy_contracts.js
     Deploying MyStringStore...
     ... 0x43b6a6888c90c38568d4f9ea494b9e2a22f55e506a8197938fb1bb6e5eaa5d34
     MyStringStore: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
   Saving successful migration to network...
     ... 0xf36163615f41ef7ed8f4a8f192149a0bf633fe1a2398ce001bf44c43dc7bdda0
   Saving artifacts...
   ```

   You can see the migrations being executed in order, followed by the blockchain address of each deployed contract (your addresses will differ).

## Testing the smart contract

Before we proceed, we should write a couple tests to ensure that our contract works as expected.

1. Create a new file named `MyStringStore.js` in the `test/` directory.

1. Add the following content to the `MyStringStore.js` file:

   ```javascript
   const MyStringStore = artifacts.require("./MyStringStore.sol");

   contract("MyStringStore", accounts => {
     it("should store the string 'Hey there!'", async () => {
       const myStringStore = await MyStringStore.deployed();

       // Set myString to "Hey there!"
       await myStringStore.set("Hey there!", { from: accounts[0] });

       // Get myString from public variable getter
       const storedString = await myStringStore.myString.call();

       assert.equal(storedString, "Hey there!", "The string was not stored");
     });
   });
   ```

### Running the tests

1. Back in the terminal, run the tests:

   ```shell
   truffle test
   ```

1. If all the tests pass, you'll see console output similar to this:

   ```shell
   Using network 'development'.

     Contract: MyStringStore
       ✓ should store the value 'Hey there!' (3085ms)

     1 passing (3s)
   ```

Awesome! Now we know that the contract actually works.

## Creating our React.js project

Now that we are done with the smart contract, we can write our front-end client with React.js! In order to do this, simply run this command (if you have NPM version 5.2 or above):

```shell
npx create-react-app client
```

**If you have an older version of NPM**, make sure Create-React-App is installed globally as per the instructions in the [Setting up the development environment](#create-react-app) section and then run the following:

```shell
create-react-app client
```

This should create a `client` directory in your Truffle project and bootstrap a barebones React.js project for you to start building your front-end with.

## Setting up the front-end client

Now that we have a front-end client located inside the `client` directory, change into that directory with the command `cd client` and continue with the following steps to set it up.

### Link up our build artifacts

Since Create-React-App's default behavior disallows importing files from outside of the `src` folder, we need to bring the contracts in our `build` folder inside `src`. We can copy and paste them every time we compile our contracts, but a better way is to create a symlink.

If you haven't created a symlink before, think of it as a magical portal in the file system that allows you act as if the file or folder is actually there.

Let's change into the `src` directory and then create our symlinked folder:

```shell
// For MacOS and Linux

cd src
ln -s ../../build/contracts contracts

// For Windows 7, 8 and 10
// Using a Command Prompt as Admin

cd src
mklink \D contracts ..\..\build\contracts
```

In effect, this should create what looks like a `contracts` folder within `src`, but it actually points to the files inside the `build/contracts` folder of our Truffle project.

### Install Drizzle

This is the most delicious part, we install Drizzle:

```shell
npm install drizzle
```

And that's it for dependencies! Note that we don't need to install Web3.js or Truffle-Contract ourselves. Drizzle contains everything we need to work reactively with our smart contracts.

## Wire up the React app with Drizzle

Before we go further, let's start our React app by running the follow command inside our `client` directory:

```shell
npm start
```

This will serve the front-end under `localhost:3000`, so open that up in your browser.

<p class="alert alert-info">
<strong>Note</strong>: Make sure to use an incognito window if you already have MetaMask installed (or disable MetaMask for now). Otherwise, the app will try to use the network specified in MetaMask rather than the development network under `localhost:8545`.
</p>

If the default Create-React-App page loaded without any issues, you may proceed.

### Setup the store

The first thing we need to do is to setup and instantiate the Drizzle store. We are going add the following 5 lines to `client/src/index.js`:

```js
// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";
import MyStringStore from "./contracts/MyStringStore.json";

// let drizzle know what contracts we want
const options = { contracts: [MyStringStore] };

// setup the drizzle store and drizzle
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);
```

First, we imported the tools from Drizzle as well as the contract definition through the linked build artifacts directory (see [Link up our build artifacts](#link-up-our-build-artifacts) above).

We then built our options object for Drizzle, which in this case is just specifying the specific contract we want to be loaded by passing in the JSON build artifact.

And finally, we created the `drizzleStore` and used that to create our `drizzle` instance which we will pass in as a prop to our `App` component.

Once that is complete, your `index.js` should look something like this:

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";
import MyStringStore from "./contracts/MyStringStore.json";

// let drizzle know what contracts we want
const options = { contracts: [MyStringStore] };

// setup the drizzle store and drizzle
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

// pass in the drizzle instance
ReactDOM.render(<App drizzle={drizzle} />, document.getElementById("root"));
registerServiceWorker();
```

Note again that the `drizzle` instance is passed into the `App` component as props.

### Wire up the App component

Now that we have a `drizzle` instance to play around with, we can go into `client/src/App.js` to start working with the React API.

#### Adding state variables

First thing we will do is to add the following line inside our App component:

```js
state = { loading: true, drizzleState: null };
```

We are going to be using two state variables here:

1. `loading` — Indicates if if Drizzle has finished initializing and the app is ready. The initialization process includes instantiating `web3` and our smart contracts, fetching any available Ethereum accounts and listening (or, in cases where subscriptions are not supported: polling) for new blocks.
2. `drizzleState` — This is where we will store the state of the Drizzle store in our top-level component. If we can keep this state variable up-to-date, then we can simply use simple `props` and `state` to work with Drizzle (i.e. you don't have to use any Redux or advanced React patterns).

#### Adding some initialization logic

Next we will add in our `componentDidMount` method into the component class so that we can run some initialization logic.

```js
componentDidMount() {
  const { drizzle } = this.props;

  // subscribe to changes in the store
  this.unsubscribe = drizzle.store.subscribe(() => {

    // every time the store updates, grab the state from drizzle
    const drizzleState = drizzle.store.getState();

    // check to see if it's ready, if so, update local component state
    if (drizzleState.drizzleStatus.initialized) {
      this.setState({ loading: false, drizzleState });
    }
  });
}
```

First, we grab the `drizzle` instance from the props, then we call `drizzle.store.subscribe` and pass in a callback function. This callback function is called whenever the Drizzle store is updated. Note that this store is actually a Redux store under the hood, so this might look familiar if you've used Redux previously.

Whenever the store is updated, we will try to grab the state with `drizzle.store.getState()` and then if Drizzle is initialized and ready, we will set `loading` to false, and also update the `drizzleState` state variable.

By doing this, `drizzleState` will always be up-to-date and we also know exactly when Drizzle is ready so we can use a loading component to let the user know.

##### Unsubscribing from the store

Note that we assign the return value of the `subscribe()` to a class variable `this.unsubscribe`. This is because it is always good practice to unsubscribe from any subscriptions you have when the component un-mounts. In order to do this, we save a reference to that subscription (i.e. `this.unsubscribe`), and inside `componentWillUnmount`, we have the following:

```js
compomentWillUnmount() {
  this.unsubscribe();
}
```

This will safely unsubscribe when the App component un-mounts so we can prevent any memory leaks.

#### Replace the `render` method

Finally, we can replace the boilerplate render method with something that applies to us better:

```js
render() {
  if (this.state.loading) return "Loading Drizzle...";
  return <div className="App">Drizzle is ready</div>;
}
```

In the next section, we will replace "Drizzle is ready" with an actual component that will read from the store. If you refresh your browser and run this app now, you should see "Loading Drizzle..." briefly flash on screen and then subsequently "Drizzle is ready".

### Full component code

When you are done this section, your `App` component should look like the following:

```js
class App extends Component {
  state = { loading: true, drizzleState: null };

  componentDidMount() {
    const { drizzle } = this.props;

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  compomentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.loading) return "Loading Drizzle...";
    return <div className="App">Drizzle is ready</div>;
  }
}
```

## Write a component to read from Drizzle

First, let's create a new file at `client/src/ReadString.js` and paste in the following:

```js
import React from "react";

class ReadString extends React.Component {
  componentDidMount() {
    const { drizzle, drizzleState } = this.props;
    console.log(drizzle);
    console.log(drizzleState);
  }

  render() {
    return <div>ReadString Component</div>;
  }
}

export default ReadString;
```

And then inside `App.js`, import the new component with this statement:

```js
import ReadString from "./ReadString";
```

Now modify your `App.js` render method so that we pass in the `drizzle` instance from props as well as the `drizzleState` from the component state:

```js
render() {
  if (this.state.loading) return "Loading Drizzle...";
  return (
    <div className="App">
      <ReadString
        drizzle={this.props.drizzle}
        drizzleState={this.state.drizzleState}
      />
    </div>
  );
}
```

Go back to the browser and open up your console. You should see that the two `console.log` statements are working and they are displaying both the `drizzle` instance as well as a `drizzleState` that is fully initialized.

What this tells us is that the `drizzleState` we get in this component will always be fully ready once this component mounts. At this point, you can take some time to explore the `drizzle` instance object as well as the `drizzleState` object.

### `drizzle` instance and `drizzleState`

For the most part, `drizzleState` is there for you to read information from (i.e. contract state variables, return values, transaction status, account data, etc.), where as the `drizzle` instance is what you will use to actually get stuff done (i.e. call contract methods, the Web3 instance, etc.).

### Wiring up the `ReadString` component

Now that we have access to our `drizzle` instance and the `drizzleState`, we can put in the logic that allows us read the smart contract variable we are interested in. Here is what the full code of `ReadString.js` should look like:

```js
import React from "react";

class ReadString extends React.Component {
  state = { dataKey: null };

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.MyStringStore;

    // let drizzle know we want to watch the `myString` method
    const dataKey = contract.methods["myString"].cacheCall();

    // save the `dataKey` to local component state for later reference
    this.setState({ dataKey });
  }

  render() {
    // get the contract state from drizzleState
    const { MyStringStore } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    const myString = MyStringStore.myString[this.state.dataKey];

    // if it exists, then we display its value
    return <p>My stored string: {myString && myString.value}</p>;
  }
}

export default ReadString;
```

If everything is working, your app should display "Hello World". But first, let's walk through what we did here.

#### When the component mounts

```js
componentDidMount() {
  const { drizzle } = this.props;
  const contract = drizzle.contracts.MyStringStore;

  // let drizzle know we want to watch the `myString` method
  const dataKey = contract.methods["myString"].cacheCall();

  // save the `dataKey` to local component state for later reference
  this.setState({ dataKey });
}
```

When the component mounts, we first grab a reference to the contract we are interested in and assign it to `contract`.

We then need to tell Drizzle to keep track of a variable we are interested in. In order to do that, we call the `.cacheCall()` function on the `myString` getter method.

What we get in return is a `dataKey` that allows us to reference this variable. We save this to the component's state so we can use it later.

#### The `render` method

```js
render() {
  // get the contract state from drizzleState
  const { MyStringStore } = this.props.drizzleState.contracts;

  // using the saved `dataKey`, get the variable we're interested in
  const myString = MyStringStore.myString[this.state.dataKey];

  // if it exists, then we display its value
  return <p>My stored string: {myString && myString.value}</p>;
}
```

From the `drizzleState`, we grab the slice of the state we are interested in, which in this case is the `MyStringStore` contract. From there, we use the `dataKey` we saved from before in order to access the `myString` variable.

Finally, we write `myString && myString.value` to show the value of the variable if it exists, or nothing otherwise. And in this case, it should show "Hello World" since that is the string the contract is initialized with.

### Quick Recap

The most important thing to get out of this section here is that there are two steps to reading a value with Drizzle:

1. First, you need to let Drizzle know what variable you want to watch for. Drizzle will give you a `dataKey` in return and you need to save it for later reference.
2. Second, due to the asynchronous nature of how Drizzle works, you should be watching for changes in `drizzleState`. Once the variable accessed by the `dataKey` exists, you will be able to get the value you are interested in.

## Write a component to write to the smart contract

Of course, simply reading a pre-initialized variable is no fun at all; we want something that we can interact with. In this section, we will create an input box where you can type a string of your choice and have it save to the blockchain forever!

First, let's create a new file `client/src/SetString.js` and paste in the following:

```js
import React from "react";

class SetString extends React.Component {
  state = { stackId: null };

  handleKeyDown = e => {
    // if the enter key is pressed, set the value with the string
    if (e.keyCode === 13) {
      this.setValue(e.target.value);
    }
  };

  setValue = value => {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.MyStringStore;

    // let drizzle know we want to call the `set` method with `value`
    const stackId = contract.methods["set"].cacheSend(value, {
      from: drizzleState.accounts[0]
    });

    // save the `stackId` for later reference
    this.setState({ stackId });
  };

  getTxStatus = () => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    // otherwise, return the transaction status
    return `Transaction status: ${transactions[txHash].status}`;
  };

  render() {
    return (
      <div>
        <input type="text" onKeyDown={this.handleKeyDown} />
        <div>{this.getTxStatus()}</div>
      </div>
    );
  }
}

export default SetString;
```

At this point, import and include it inside `App.js` just like you did with the `ReadString` component:

```js
import SetString from "./SetString";

// ...

  render() {
    if (this.state.loading) return "Loading Drizzle...";
    return (
      <div className="App">
        <ReadString
          drizzle={this.props.drizzle}
          drizzleState={this.state.drizzleState}
        />
        <SetString
          drizzle={this.props.drizzle}
          drizzleState={this.state.drizzleState}
        />
      </div>
    );
  }
```

At this point, the app should work and you should try it out. You should be able to type something into the input text box, hit Enter, and Drizzle's react store will automatically display the new string.

Next, let's go through `SetString.js` step-by-step.

### General structure

First let's take a look at the general React.js boilerplate that we need.

```js
class SetString extends React.Component {
  state = { stackId: null };

  handleKeyDown = e => {
    // if the enter key is pressed, set the value with the string
    if (e.keyCode === 13) {
      this.setValue(e.target.value);
    }
  };

  setValue = value => { ... };

  getTxStatus = () => { ... };

  render() {
    return (
      <div>
        <input type="text" onKeyDown={this.handleKeyDown} />
        <div>{this.getTxStatus()}</div>
      </div>
    );
  }
}
```

In this component, we will have an input text box for the user to type in a string, and when the Enter key is pressed, the `setValue` method will be called with the string as a parameter.

Also, we will display the status of the transaction. The `getTxStatus` method will return a string displaying the status of the transaction by referencing a `stackId` state variable (more on this later).

### Submitting the transaction

```js
setValue = value => {
  const { drizzle, drizzleState } = this.props;
  const contract = drizzle.contracts.MyStringStore;

  // let drizzle know we want to call the `set` method with `value`
  const stackId = contract.methods["set"].cacheSend(value, {
    from: drizzleState.accounts[0]
  });

  // save the `stackId` for later reference
  this.setState({ stackId });
};
```

We first assign the contract from the `drizzle` instance into `contract`, and then we call `cacheSend()` on the method we are interested in (i.e. `set`). Then we pass in the string we want to set (i.e. `value`) as well as our transaction options (in this case, just the `from` field). Note that we can get our current account address from `drizzleState.accounts[0]`.

What we get in return is a `stackId`, which is a reference to the transaction that we want to execute. Ethereum transactions don't receive a hash until they're broadcast to the network. In case an error occurs before broadcast, Drizzle keeps track of these transactions by giving each it's own ID. Once successfully broadcasted, the `stackId` will point to the transaction hash, so we save it in our local component state for later usage.

### Tracking transaction status

```js
getTxStatus = () => {
  // get the transaction states from the drizzle state
  const { transactions, transactionStack } = this.props.drizzleState;

  // get the transaction hash using our saved `stackId`
  const txHash = transactionStack[this.state.stackId];

  // if transaction hash does not exist, don't display anything
  if (!txHash) return null;

  // otherwise, return the transaction status
  return `Transaction status: ${transactions[txHash].status}`;
};
```

Now that we have a `stackId` saved into our local component state, we can use this to check the status of our transaction. First, we need the `transactions` and `transactionStack` slices of state from `drizzleState`.

Then, we can get the transaction hash (assigned to `txHash`) via `transactionStack[stackId]`. If the hash does not exist, then we know that the transaction has not been broadcasted yet and we return null.

Otherwise, we display a string to show the status of our transaction. Usually, this will either be "pending" or "success".

# The End

Congratulations! You have taken a huge step to understanding how Drizzle works. Of course, this is only the beginning, you can use tools like [`drizzle-react`](https://github.com/trufflesuite/drizzle-react) to help you integrate Drizzle into your dapp, reducing the necessary boilerplate that you would have to write.

Alternatively, you could also bootstrap your Drizzle dapp with our [Truffle box](https://github.com/truffle-box/drizzle-box).
