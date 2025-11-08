import { MessageCallback } from "@shsp/types/index";

export interface IShspPeer {
    /**
     * Sends the provided payload to the remote peer using the bound IP/port.
     * Accepts both textual and binary payloads.
     */
    sendMessage(message: string | Buffer): void;
    /**
     * Produces a JSON representation describing the peer state,
     * including remote endpoints and socket status.
     */
    serializedObject(): string;
    /**
     * Registers a callback invoked when a message from the peer is received,
     * passing both the payload and network metadata.
     */
    setMessageCallback(cb: MessageCallback): void;
}