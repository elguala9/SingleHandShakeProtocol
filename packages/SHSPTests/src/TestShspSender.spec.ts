import { IShspSocket } from "@shsp/interfaces/index";
import readline from "node:readline";
import { expect } from "chai";

export function testSender(socket: IShspSocket, port: number) {
  describe("SHSP Sender", function () {


    it("Should log local address and send a packet", function (done) {
      console.log("[SENDER] Local address:", socket.address());
      askRemoteInfo().then(({ ip, remotePort }) => {
        if (!ip || !remotePort) {
          console.warn("[SENDER] IP o porta non validi, skipping send test");
          return done();
        }
        const message = Buffer.from("Hello from SHSP sender!");
        socket.send(message, 0, message.length, remotePort, ip, (err: any) => {
          if (err) return done(err);
          console.log("[SENDER] Sent message to", ip, remotePort);
          done();
        });
      });
    });

    it("Should close the socket", function () {
      socket.close();
    });
  });
}

function askRemoteInfo(): Promise<{ ip: string; remotePort: number }> {
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

// Esempio di utilizzo:
// import { createShspSocket } from '@shsp/implementations';
// testSender(createShspSocket('udp4'), 50000);
