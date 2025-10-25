import { StunResponse, LocalInfo } from "@shsp/types/index";
import { IShspSocket } from "./IShspSocket";

export interface IStunHandler {
    performStunRequest(): Promise<StunResponse>;
    performLocalRequest(): Promise<LocalInfo>;
    pingStunServer(): Promise<boolean>;
    setStunServer(address: string, port: number): void;
    getSocket(): IShspSocket;
    close(): void;
}