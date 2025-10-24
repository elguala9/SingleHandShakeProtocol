import { ShspSocket } from '../implementations/ShspSocket';
import { CallbackMap } from './CallbackMap';
import { RemoteInfo, SocketType, createSocket as createSocketDgram } from 'node:dgram';

export function createShspSocket(options?: any): ShspSocket {
	const messageCallbacks = new CallbackMap<[Buffer, RemoteInfo]>();
	return new ShspSocket(messageCallbacks, options);
}

export function createSocket(type: SocketType, 
    callback?: (msg: NonSharedBuffer, rinfo: RemoteInfo) => void): ShspSocket {
	const messageCallbacks = new CallbackMap<[Buffer, RemoteInfo]>();
    let socket = createSocketDgram('udp4', callback);
	return new ShspSocket(messageCallbacks, socket);
}
