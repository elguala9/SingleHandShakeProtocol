export const DEFAULT_STUN_CONFIG = {
  address: 'stun.l.google.com',
  port: 19302,
  localPort: 49152
};
import { IShspSocket, IStunHandler } from '@shsp/interfaces/index';
import { LocalInfo, StunResponse } from '@shsp/types/index';
import stun from 'stun';
import { createSocket } from '../utility/CreateSocket';
import { getLocalIp } from '../utility/AddressUtility';

type StunHandlerInput = {
  address?: string;
  port?: number;
  localPort?: number;
}

export class StunHandler implements IStunHandler {
  private stunAddress!: string;
  private stunPort!: number;

  private readonly socket: IShspSocket;

  constructor(input?: StunHandlerInput) {
    const {
      address = DEFAULT_STUN_CONFIG.address,
      port = DEFAULT_STUN_CONFIG.port,
      localPort = DEFAULT_STUN_CONFIG.localPort
    } = input || {};
    this.setStunServer(address, port);
    this.socket = createSocket('udp4');
    this.socket.bind(localPort);
  }

  async performLocalRequest(): Promise<LocalInfo> {
    const addressInfo = this.socket.address();
    if (typeof addressInfo === 'string' || typeof addressInfo.port !== 'number') {
      throw new Error('[StunHandler] Impossibile determinare la porta locale dal socket.');
    }
    return {
      localIp: await getLocalIp(),
      localPort: addressInfo.port,
    };
  }


  getSocket(): IShspSocket {
    return this.socket;
  }

  close(): void {
    this.socket.close();
  }

  setStunServer(address: string, port: number): void {
    this.stunAddress = (typeof address === 'string' && address.trim().length > 0) ? address : 'stun.l.google.com';
    this.stunPort = (typeof port === 'number' && port > 0 && port < 65536) ? port : 19302;
  }

  async performStunRequest(): Promise<StunResponse> {
    const server = `${this.stunAddress}:${this.stunPort}`;
    const res = await stun.request(server, { socket: this.socket });
    console.log('[StunHandler] STUN response received:', res);
    const xorAddr = res.getXorAddress();
    return {
      publicIp: xorAddr.address,
      publicPort: xorAddr.port,
      transactionId: res.transactionId,
      raw: res,
      attrs: res,
    };
  }

  async pingStunServer(): Promise<boolean> {
    try {
      await this.performStunRequest();
      return true;
    } catch {
      return false;
    }
  }
}