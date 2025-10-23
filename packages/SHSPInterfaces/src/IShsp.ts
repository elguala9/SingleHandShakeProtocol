import { Socket } from "node:dgram";


export interface IShsp {
    getSignal(): string;
    setSignal(signal: string): void;
    getSocket(): Socket;
    serializedObject(): string;
}