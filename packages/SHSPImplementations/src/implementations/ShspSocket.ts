import { IShspSocket } from '@shsp/interfaces/index';
import { RemoteInfo, Socket } from 'node:dgram';
import { formatAddress } from '../utility/AddressUtility';
import { CallbackMap } from '../utility/CallbackMap';

export class ShspSocket extends Socket implements IShspSocket {


  
  private readonly messageCallbacks: CallbackMap<[Buffer, RemoteInfo]>;
  private listeningCallback?: () => void;
  private closeCallback?: () => void;
  private errorCallback?: (err: Error) => void;
  private connectCallback?: () => void;

  // TO DO: fix any type
  constructor(messageCallbacks: CallbackMap<[Buffer, RemoteInfo]>, 
  options?: any) {
    super(options);
    this.messageCallbacks = messageCallbacks;
    this.setOn()
  }

  // Permette di registrare un callback per un messaggio specifico
  public setMessageCallback(key: string, cb: (msg: Buffer, rinfo: RemoteInfo) => void): void {
    this.messageCallbacks.add(key, cb);
  }

  private setOn(): void {
    this.on('message', (msg: Buffer, rinfo: RemoteInfo) => this.onMessage(msg, rinfo));
    this.on('listening', () => this.onListening());
    this.on('close', () => this.onClose());
    this.on('error', (err: Error) => this.onError(err));
    this.on('connect', () => this.onConnect());
  }

  // Crea una ShspSocket a partire da un Socket esistente (senza accedere a proprietà private)
  static fromSocket(socket: Socket, messageCallbacks: CallbackMap<[Buffer, RemoteInfo]>): ShspSocket {
    const addr = socket.address();
    const options: any = { reuseAddr: true };
    const shspSocket = new ShspSocket(messageCallbacks, options);
    shspSocket.bind(addr.port, addr.address);

    // Copia le proprietà private se presenti
    const sAny = socket as any;
    if (sAny.listeningCallback) shspSocket.listeningCallback = sAny.listeningCallback;
    if (sAny.closeCallback) shspSocket.closeCallback = sAny.closeCallback;
    if (sAny.errorCallback) shspSocket.errorCallback = sAny.errorCallback;
    if (sAny.connectCallback) shspSocket.connectCallback = sAny.connectCallback;

    socket.close(); // chiude il vecchio socket
    return shspSocket;
  }
  
  setListeningCallback(cb: () => void): void {
    this.listeningCallback = cb;
  }

  setCloseCallback(cb: () => void): void {
    this.closeCallback = cb;
  }

  setErrorCallback(cb: (err: Error) => void): void {
    this.errorCallback = cb;
  }

  setConnectCallback(cb: () => void): void {
    this.connectCallback = cb;
  }



  onListening(): void {
    if (this.listeningCallback) this.listeningCallback();
  }

  onClose(): void {
    if (this.closeCallback) this.closeCallback();
  }

  onError(err: Error): void {
    if (this.errorCallback) this.errorCallback(err);
  }

  onConnect(): void {
    if (this.connectCallback) this.connectCallback();
  }

  // Override handler per i messaggi ricevuti
  onMessage(msg: Buffer, rinfo: RemoteInfo): void {
    const cb = this.messageCallbacks.get(formatAddress(rinfo));
    if (cb)
      cb(msg, rinfo);
  }
  
  serializedObject(): string {
    return JSON.stringify({
      localPort: this.address().port,
      localAddress: this.address().address,
      messageCallbackKeys: Array.from(this.messageCallbacks.keys())
    });
  }
}