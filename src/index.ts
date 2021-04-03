class SmartWeaveTester {
  private handle;
  public caller;

  public state;

  public block = {
    height: 0,
  };

  constructor(handle: Function, initialState: Object, caller: string) {
    this.handle = handle;
    this.caller = caller;
    this.state = initialState;

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