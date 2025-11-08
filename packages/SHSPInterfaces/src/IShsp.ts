import { Socket } from "node:dgram";


export interface IShsp {
    /**
     * Returns the current signaling token (e.g., invitation/handshake string) for this SHSP peer.
     */
    getSignal(): string;
    /**
     * Updates the signaling token associated with the peer, used for handshake or coordination.
     */
    setSignal(signal: string): void;
    /**
     * Returns the underlying UDP socket associated with this SHSP instance.
     */
    getSocket(): Socket;
    /**
     * Serializes the current state of the instance as a stringified JSON document.
     */
    serializedObject(): string;
}