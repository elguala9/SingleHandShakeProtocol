import { Socket } from "node:dgram";


export interface IShspSocket extends Socket{
    /**
     * Returns the socket state as a serialized string (type, endpoints, registered callbacks).
     */
    serializedObject(): string;

    /**
     * Registers the callback invoked when the socket begins listening.
     */
    setListeningCallback(cb: () => void): void;
    /**
     * Registers the callback executed when the socket closes.
     */
    setCloseCallback(cb: () => void): void;
    /**
     * Registers the callback invoked when the socket encounters an error.
     */
    setErrorCallback(cb: (err: Error) => void): void;
    /**
     * Registers the callback executed when the socket completes a connection.
     */
    setConnectCallback(cb: () => void): void;
    /**
     * Associates a callback with incoming messages from a specific remote endpoint.
     */
    setMessageCallback(key: string, cb: (msg: Buffer, rinfo: import('node:dgram').RemoteInfo) => void): void;

    /**
     * Internal callback triggered when the socket starts listening.
     */
    onListening(): void;
    /**
     * Internal callback triggered when the socket closes.
     */
    onClose(): void;
    /**
     * Internal callback triggered for socket errors.
     */
    onError(err: Error): void;
    /**
     * Internal callback triggered when the socket establishes a connection.
     */
    onConnect(): void;
    /**
     * Internal callback triggered upon receiving a UDP message to enable custom handling.
     */
    onMessage(msg: Buffer, rinfo: import('node:dgram').RemoteInfo): void;
    //handshake(): void;
}