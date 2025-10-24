import { RemoteInfo } from 'node:dgram';
import { StunResponse } from '@shsp/types/index';

export function formatAddress(rinfo: RemoteInfo): string {
  return formatAddressParts(rinfo.address, rinfo.port);
}

export function formatAddressParts(address: string, port: number): string {
  return `${address}:${port}`;
}

export function formatAddressStun(response: StunResponse): string {
  return formatAddressParts(response.publicIp, response.publicPort);
}
