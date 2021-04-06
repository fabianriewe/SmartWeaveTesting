import Arweave from "arweave";

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
  public block = {
    height: 0,
  };


  public arweave = {
    ar: arweave.ar,
    utils: arweave.utils,
    wallets: arweave.wallets,
    crypto: arweave.crypto,
  }

  constructor(handle: Function, initialState: Object, caller: string, customArweave?: Arweave) {
    this.handle = handle;
    this.caller = caller;
    this.state = initialState;

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

  async execute(input: object, updateState: boolean = true) {
    const state = (
      await this.handle(this.state, {caller: this.caller, input})
    ).state;

    if (updateState) this.state = state;

    // simulate block generation
    this.block.height++;

    return state;
  }
}

export default SmartWeaveTester;