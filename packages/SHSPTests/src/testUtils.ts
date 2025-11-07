import { IShspSocket } from "@shsp/interfaces/index";
import readline from "node:readline";

export function askRemoteInfo(): Promise<{ ip: string; remotePort: number }> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question("Inserisci IP del peer destinatario: ", (ip) => {
      rl.question("Inserisci porta del peer destinatario: ", (portStr) => {
        rl.close();
        resolve({ ip: ip.trim(), remotePort: Number(portStr.trim()) });
      });
    });
  });
}

export function sendMultiplePackets(
  socket: IShspSocket,
  ip: string,
  remotePort: number,
  label: string,
  count: number = 5,
  intervalMs: number = 20000
): Promise<void> {
  return new Promise((resolve, reject) => {
    let packetNumber = 0;
    
    const sendPacket = () => {
      packetNumber++;
      const message = Buffer.from(`Hello from ${label}! Packet ${packetNumber}/${count}`);
      
      socket.send(message, 0, message.length, remotePort, ip, (err: any) => {
        if (err) {
          console.error(`[${label}] Error sending packet ${packetNumber}:`, err);
          return reject(err);
        }
        console.log(`[${label}] Sent packet ${packetNumber}/${count} to`, ip, remotePort);
        
        if (packetNumber >= count) {
          resolve();
        } else {
          setTimeout(sendPacket, intervalMs);
        }
      });
    };
    
    sendPacket();
  });
}
