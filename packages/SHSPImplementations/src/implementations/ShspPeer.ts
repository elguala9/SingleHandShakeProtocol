import { IShspPeer, IShspSocket } from '@shsp/interfaces/index';
import { MessageCallback, PeerInfo } from '@shsp/types/index';
import { formatAddressParts } from 'src/utility/AddressUtility';

export class ShspPeer implements IShspPeer {
  private readonly remoteIp: string;
  private readonly remotePort: number;
  private readonly socket: IShspSocket;
  private onMessageCallback?: MessageCallback; // Added property



  constructor(remoteIp: string, remotePort: number, socket: IShspSocket) {
    this.remoteIp = remoteIp;
    this.remotePort = remotePort;
    this.socket = socket;
    // Inizializza il callback locale nel socket
    this.socket.setMessageCallback(formatAddressParts({ address: this.remoteIp, port: this.remotePort }), (msg, rinfo) => {
      this.onMessage(msg, { address: rinfo.address, port: rinfo.port });
    });
  }

  close(): void {
    this.socket.close();
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

  /**
   * Registra un callback locale per la ricezione di messaggi
   */
  setMessageCallback(cb: MessageCallback): void {
    this.onMessageCallback = cb;
  }

  /**
   * Da chiamare quando arriva un messaggio destinato a questo peer
   */
  onMessage(msg: Buffer, info: PeerInfo): void {
    if (this.onMessageCallback) {
      this.onMessageCallback(msg, info);
    }
  }

}