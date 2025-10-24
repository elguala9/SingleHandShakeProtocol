import { Socket } from "node:dgram";


export interface IShspPeer {
    sendMessage(message: string | Buffer): void;
    serializedObject(): string;
    close(): void;
}