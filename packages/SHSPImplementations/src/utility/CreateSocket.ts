import { ShspSocketNode } from '../implementations/ShspSocketNode';
import { CallbackMap } from './CallbackMap';
import { RemoteInfo, SocketType, createSocket as createSocketDgram } from 'node:dgram';

export function createShspSocket(options?: any): ShspSocketNode {
	const messageCallbacks = new CallbackMap<[Buffer, RemoteInfo]>();
	return new ShspSocketNode(messageCallbacks, options);
}

export function createSocket(type: SocketType, 
    callback?: (msg: NonSharedBuffer, rinfo: RemoteInfo) => void): ShspSocketNode {
	const messageCallbacks = new CallbackMap<[Buffer, RemoteInfo]>();
    let socket = createSocketDgram('udp4', callback);
	return new ShspSocketNode(messageCallbacks, socket);
}
