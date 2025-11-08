export interface PeerInfo {
  address: string;
  family?: "IPv4" | "IPv6";
  port: number;
}

export type MessageCallback = (msg: Buffer, rinfo: PeerInfo) => void