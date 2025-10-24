import { IShsp } from '@shsp/interfaces/index';
import { Socket, createSocket, RemoteInfo } from 'node:dgram';

export class Shsp implements IShsp {
  private socket: Socket;
  private remoteIp: string;
  private remotePort: number;
  private signal: string = '';

  constructor(remoteIp: string, remotePort: number) {
    this.remoteIp = remoteIp;
    this.remotePort = remotePort;
    this.socket = createSocket('udp4');
    // Puoi aggiungere qui eventuali handler per messaggi in arrivo
    this.socket.on('message', (msg: Buffer, rinfo: RemoteInfo) => {
      // Gestione messaggi ricevuti
      // console.log('Received:', msg.toString(), 'from', rinfo.address, rinfo.port);
    });
  }

  getSignal(): string {
    return this.signal;
  }

  setSignal(signal: string): void {
    this.signal = signal;
  }

  getSocket(): Socket {
    return this.socket;
  }

  serializedObject(): string {
    return JSON.stringify({
      remoteIp: this.remoteIp,
      remotePort: this.remotePort,
      signal: this.signal
    });
  }

  // Metodo per chiudere il socket
  close(): void {
    this.socket.close();
  }
}