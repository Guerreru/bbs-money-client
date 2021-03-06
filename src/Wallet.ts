import { Client } from './Client';

export enum TransactionStatus {
  NORMAL = 'normal',
  LOCKED = 'locked',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  SPENT = 'spent',
}

export interface Balance {
  address: string;
  available: string;
  locked: string;
  total: string;
}

export interface Destination {
  address: string;
  amount: string;
}

export interface Transaction {
  hash: string;
  height: number;
  timestamp: number;
  in: string;
  out: string;
  fee: string;
  fusion: boolean;
  amount: string;
  unlockTime: number;
  status: TransactionStatus;
}

export interface TransactionDetails extends Transaction {
  coinbase: boolean;
  confirmations: number;
  paymentId: string;
  destinations: Destination[];
}

export class Wallet {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async getBalance(): Promise<Balance> {
    return <Balance>(await this.client.request('POST', '/wallet/balance')).data;
  }

  public async getTransactionDetails(hash: string): Promise<TransactionDetails> {
    return <TransactionDetails>(await this.client.request(
      'POST',
      '/wallet/transaction-details',
      {
        hash,
      }
    )).data;
  }

  public async getTransactions(offset: number = 0, limit: number = 10): Promise<Transaction[]> {
    const response: any = (await this.client.request('POST', '/wallet/transactions', {
      offset,
      limit,
    })).data;

    return <Transaction[]>response.transactions;
  }

  public async send(destinationAddress: string, amount: string, fee: string, paymentId: string = '', mixin: number = 0): Promise<string> {
    const response: any = (await this.client.request('POST', '/wallet/send', {
      mixin,
      fee,
      paymentId,
      transfers: [
        {
          address: destinationAddress,
          amount
        }
      ]
    })).data;

    return <string>response.hash;
  }
}
