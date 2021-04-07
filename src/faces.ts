export interface Transaction {
  id: number
  owner: string,
  target?: string,
  tags?: Record<string, string | string[]>,
  quantity?: string
  rewards?: number
}

export interface TransactionInput {
  target?: string,
  tags?: Record<string, string | string[]>,
  quantity?: { winston: string }
  rewards?: number
}

export interface Block {
  height: number
}