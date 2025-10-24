import { Socket } from "node:dgram";


export interface IShspSocket extends Socket{
    serializedObject(): string;

    setListeningCallback(cb: () => void): void;
    setCloseCallback(cb: () => void): void;
    setErrorCallback(cb: (err: Error) => void): void;
    setConnectCallback(cb: () => void): void;
    setMessageCallback(key: string, cb: (msg: Buffer, rinfo: import('node:dgram').RemoteInfo) => void): void;

    onListening(): void;
    onClose(): void;
    onError(err: Error): void;
    onConnect(): void;
    onMessage(msg: Buffer, rinfo: import('node:dgram').RemoteInfo): void;

}