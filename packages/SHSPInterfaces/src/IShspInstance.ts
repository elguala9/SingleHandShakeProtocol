import { IShspPeer } from "./IShspPeer";

export interface IShspInstance extends IShspPeer {
    /**
     * Closes network resources and terminates communication with the peer.
     */
    close(): void;
    /**
     * Indicates whether the protocol handshake completed successfully.
     */
    getHandshake(): boolean;
    /**
     * Indicates whether a closing message was received but the connection is still pending termination.
     */
    getClosing(): boolean;
    /**
     * Indicates whether the connection is currently open and operational.
     */
    getOpen(): boolean;
}