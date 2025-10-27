import { StunHandler } from "@shsp/implementations/index";
import { expect } from "chai";
import readline from "node:readline";

// Test inviante: mostra IP/porta pubblici, chiede IP/porta destinatario e invia pacchetto

describe("SHSP Sender", function () {
  let handler: StunHandler;
  let socket: any;

  before(async function () {
    this.timeout(20000);
    handler = new StunHandler();
    socket = handler.getSocket();
  });

  it("Should perform STUN request and log public IP/port", async function () {
    const stunRes = await handler.performStunRequest();
    console.log("[SENDER] Public IP:", stunRes.publicIp, "Public Port:", stunRes.publicPort);
    expect(stunRes).to.have.property("publicIp");
    expect(stunRes).to.have.property("publicPort");
  });

  it("Should ask for remote IP/port and send packet", function (done) {
    askRemoteInfo().then(({ ip, port }) => {
      if (!ip || !port) {
        console.warn("[SENDER] IP o porta non validi, skipping send test");
        return done();
      }
      const message = Buffer.from("Hello from SHSP sender!");
      socket.send(message, 0, message.length, port, ip, (err: any) => {
        if (err) return done(err);
        console.log("[SENDER] Sent message to", ip, port);
        done();
      });
    });
  });
});

function askRemoteInfo(): Promise<{ ip: string; port: number }> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question("Inserisci IP del peer destinatario: ", (ip) => {
      rl.question("Inserisci porta del peer destinatario: ", (portStr) => {
        rl.close();
        resolve({ ip: ip.trim(), port: Number(portStr.trim()) });
      });
    });
  });
}
