import { IShspPeer, IShspSocket } from '@shsp/interfaces/index';
import { Socket } from 'node:dgram';

export class ShspPeer implements IShspPeer {
  private readonly remoteIp: string;
  private readonly remotePort: number;
  private readonly socket: IShspSocket;

  constructor(remoteIp: string, remotePort: number, socket: IShspSocket) {
    this.remoteIp = remoteIp;
    this.remotePort = remotePort;
    this.socket = socket;
  }
  close(): void {
    throw new Error('Method not implemented.');
  }

  serializedObject(): string {
    return JSON.stringify({
      remoteIp: this.remoteIp,
      remotePort: this.remotePort,
      socket: this.socket.serializedObject()
    });
  }

  // Metodo per inviare un messaggio al peer
  sendMessage(message: string | Buffer): void {
    this.socket.send(message, this.remotePort, this.remoteIp);
  }

}