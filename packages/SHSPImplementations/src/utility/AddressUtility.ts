import { RemoteInfo } from 'node:dgram';
import { StunResponse, PeerInfo } from '@shsp/types/index';

export function formatAddress(rinfo: RemoteInfo): string {
  return formatAddressParts({
    address: rinfo.address,
    port: rinfo.port,
    family: rinfo.family
  });
}

export function formatAddressParts(peerInfo: PeerInfo): string {
  return `${peerInfo.address}:${peerInfo.port}`;
}

export function formatAddressStun(response: StunResponse): string {
  return formatAddressParts({
    address: response.publicIp,
    port: response.publicPort,
    family: "IPv4"
  });
}

/**
 * Restituisce l'IP privato locale (LAN) in modo cross-platform.
 * - In browser: usa WebRTC/ICE
 * - In Node.js: usa os.networkInterfaces
 * - In altri ambienti: throw new Error('getLocalIp not supported in this environment');
 */
export async function getLocalIp(): Promise<string> {
  // Browser: usa WebRTC/ICE
  if (typeof globalThis !== 'undefined' && globalThis.RTCPeerConnection) {
    const ip = await getIpViaWebRTC();
    if (ip === null) {
      throw new Error('Unable to determine local IP via WebRTC');
    }
    return ip;
  }
  // Node.js: usa node:os
  if (typeof require !== 'undefined') {

      const os = require('node:os');
      const interfaces = os.networkInterfaces();
      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
          if (
            iface.family === 'IPv4' &&
            !iface.internal &&
            isPrivateIp(iface.address)
          ) {
            return iface.address;
          }
        }
    }
  }
  // Mobile/altro: non supportato senza plugin nativi
  throw new Error('getLocalIp not supported in this environment');
}

function isPrivateIp(ip: string): boolean {
  return (
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

// WebRTC/ICE: recupera IP locale dal browser
function getIpViaWebRTC(): Promise<string | null> {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    pc.createOffer().then(offer => pc.setLocalDescription(offer));
    pc.onicecandidate = (event) => {
      const candidateStr = event?.candidate?.candidate;
      if (candidateStr) {
        const ipMatch = /([\d]{1,3}(?:\.[\d]{1,3}){3})/.exec(candidateStr);
        if (ipMatch && isPrivateIp(ipMatch[1])) {
          resolve(ipMatch[1]);
          pc.close();
        }
      } else if (!event.candidate) {
        resolve(null);
        pc.close();
      }
    };
  });
}
