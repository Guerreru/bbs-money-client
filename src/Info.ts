import { Client } from './Client';

export interface SystemInfo {
  lastSyncedHeight: number;
  currentHeight: number;
  lastUpdated: number;
}

export class Info {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async all(): Promise<SystemInfo> {
    return <SystemInfo>(await this.client.request('POST', '/info/all', null, false)).data;
  }

  public async supply(): Promise<string> {
    return <string>(await this.client.request('GET', '/info/supply', null, false)).data;
  }
}
