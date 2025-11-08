import { IShspSocket } from '@shsp/interfaces/index';
import { RemoteInfo, Socket } from 'node:dgram';
import { formatAddress } from '../utility/AddressUtility';
import { CallbackMap } from '../utility/CallbackMap';

export class ShspSocketNode extends Socket implements IShspSocket {
  private readonly messageCallbacks: CallbackMap<[Buffer, RemoteInfo]>;
  private listeningCallback?: () => void;
  private closeCallback?: () => void;
  private errorCallback?: (err: Error) => void;
  private connectCallback?: () => void;

  constructor(messageCallbacks: CallbackMap<[Buffer, RemoteInfo]>, options?: any) {
    super(options);
    this.messageCallbacks = messageCallbacks;
    this.setOn();
  }

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

  onMessage(msg: Buffer, rinfo: RemoteInfo): void {
    const cb = this.messageCallbacks.get(formatAddress(rinfo));
    if (cb) cb(msg, rinfo);
  }

  serializedObject(): string {
    return JSON.stringify({
      localPort: this.address().port,
      localAddress: this.address().address,
      messageCallbackKeys: Array.from(this.messageCallbacks.keys())
    });
  }
}
