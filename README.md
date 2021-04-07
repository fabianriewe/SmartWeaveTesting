# SmartWeave Testing

A testing client for SmartWeave contracts. You can execute any kind of `interactWrite` input against your contract. It does not require any connection to Arweave.
This enables fast and reliable testing. The new state
of the contract will be stored and by this enabling multi input testing.
## Installation
```
yarn add --dev smartweave-testing
```

### Usage
```ts
import SmartWeaveTester from "smartweave-testing"
import { handle } from [my-contract]

const caller = "..." // -> e.g your Arweave Address
const initialState = {}
const smartweave = new SmartWeaveTester(handle, initialState, caller)
```
### Executing an action
```ts
input = { function: "my_function" };
result = await smartweave.execute(input); // -> state of the contract
```
In case you don't want to update the state of your contract use `execute({}, false)`

### Manipulating block height
If your contract uses `SmartWeave.block.height`, the client will make use of it's internal block logic.
Every time you execute an action, the block height will increase by 1. You can use
`smartweave.block.height = ...` to manually adjust the block height.

### Setting transaction information
If you want to use custom transaction information like `tags`, `quantity` or a target, you can add
these into the constructor or the `execute` function: 
```ts
import {TransactionInput} from "smartweave-testing/faces";

const txInformation: TransactionInput = {
  quantity: {winston: "1"} // -> quantity in winston,
  target: "...."
} 
result = await smartweave.execute(input, true, txInformation);
```

### Examples
```ts
import SmartWeaveTester from "smartweave-testing"
import { handle } from [my-contract]

const caller = "..." // -> e.g your Arweave Address

const initialState = {
  balances: {}
}

const smartweave = new SmartWeaveTester(handle, initialState, caller)

let input, result;

// the dispense function increases the callers balance by 100
input = { function: "dispense" };
result = await smartweave.execute(input);
if (result.balances[caller] !== 100) throw Error("Dispense does not work")

// be rerunning the action, the old state is preserved and get's updated
input = { function: "dispense" };
result = await smartweave.execute(input);
if (result.balances[caller] !== 200) throw Error("Dispense does not work")
```