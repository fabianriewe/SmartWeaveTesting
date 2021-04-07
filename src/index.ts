import Arweave from "arweave";
import {Block, Transaction, TransactionInput} from "./faces";

const arweave = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https",
})

class SmartWeaveTester {
  private handle: Function;
  public caller: string;

  public state: Object;

  // public smartweave extensions
  public block: Block;

  public transaction: Transaction;
  private transactionID: number = 0;


  public arweave = {
    ar: arweave.ar,
    utils: arweave.utils,
    wallets: arweave.wallets,
    crypto: arweave.crypto,
  }

  constructor(handle: Function, initialState: Object, caller: string, customArweave?: Arweave, interactionTX?: TransactionInput) {
    this.handle = handle;
    this.caller = caller;
    this.state = initialState;

    this.block = {
      height: 0,
    }

    this.transaction = {
      id: this.transactionID++,
      owner: this.caller,
      target: interactionTX?.target,
      tags: interactionTX?.tags,
      quantity: interactionTX?.quantity?.winston,
      rewards: interactionTX?.rewards
    }

    if (customArweave) {
      this.arweave = {
        ar: customArweave.ar,
        utils: customArweave.utils,
        wallets: customArweave.wallets,
        crypto: customArweave.crypto,
      }
    }

    // @ts-ignore
    global.SmartWeave = this;
    // @ts-ignore
    global.ContractError = Error;
    const ContractError = Error;
    // @ts-ignore
    global.ContractAssert = (cond, message) => {
      if (!cond) throw new ContractError(message)
    };
  }

  async execute(input: object, updateState: boolean = true, interactionTX?: TransactionInput) {
    const state = (
      await this.handle(this.state, {caller: this.caller, input})
    ).state;

    if (updateState) this.state = state;

    // simulate block generation
    this.block.height++;

    // generate new transaction
    this.transaction = {
      id: this.transactionID++,
      owner: this.caller,
      target: interactionTX?.target,
      tags: interactionTX?.tags,
      quantity: interactionTX?.quantity?.winston,
      rewards: interactionTX?.rewards
    }

    return state;
  }
}

export default SmartWeaveTester;