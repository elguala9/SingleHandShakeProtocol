import { IShspInstance, IShspSocket } from '@shsp/interfaces/index';
import { PeerInfo } from '@shsp/types/index';
import { ShspPeer } from './ShspPeer';



export class ShspInstance extends ShspPeer  implements IShspInstance {
  private _handshake: boolean = false;
  private _closing: boolean = false;
  private _open: boolean = false;

  constructor(remoteIp: string, remotePort: number, socket: IShspSocket) {
    super(remoteIp, remotePort, socket);
  }
  /**
   * Da chiamare quando arriva un messaggio destinato a questo peer
   */
  onMessage(msg: Buffer, info: PeerInfo): void {
    if(this.isHandshake(msg) === true)
      return;
    if(this.isClosing(msg) === true)
      return;
    if(this.isClosed(msg) === true)
      return;
    if(this.isKeepAlive(msg) === true)
      return;
    super.onMessage(msg, info);
  }


  private isHandshake(msg: Buffer): boolean {
    if(msg[0] === 0x01){
      this._handshake = true;
      this._open = true;
      return true;
    }
    return false;
  }

  private isClosing(msg: Buffer): boolean {
    if(msg[0] === 0x02){
      this._closing = true;
      return true;
    }
    return false;
  }

  private isClosed(msg: Buffer): boolean {
    if(msg[0] === 0x03){
      this._open = false;
      return true;
    }
    return false;
  }

    private isKeepAlive(msg: Buffer): boolean {
    if(msg[0] === 0x04)
      return true;
    return false;
  }

  public getHandshake(): boolean {
    return this._handshake;
  }
  public getClosing(): boolean {
    return this._closing;
  }
  public getOpen(): boolean {
    return this._open;
  }
}