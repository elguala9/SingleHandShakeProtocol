import { StunResponse, LocalInfo } from "@shsp/types/index";
import { IShspSocket } from "./IShspSocket";

export interface IStunHandler {
    /**
     * Performs a STUN request and returns the public (IP, port) inferred by the server.
     */
    performStunRequest(): Promise<StunResponse>;
    /**
     * Retrieves local (IP, port) information without contacting the STUN server.
     */
    performLocalRequest(): Promise<LocalInfo>;
    /**
     * Verifies the reachability of the configured STUN server.
     */
    pingStunServer(): Promise<boolean>;
    /**
     * Sets the STUN server address/port used for subsequent requests.
     */
    setStunServer(address: string, port: number): void;
    /**
     * Returns the underlying socket used to communicate with the STUN server.
     */
    getSocket(): IShspSocket;
    /**
     * Closes the socket and releases resources held by the STUN handler.
     */
    close(): void;
}