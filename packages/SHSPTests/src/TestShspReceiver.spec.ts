import { StunHandler } from "@shsp/implementations/index";
import { expect } from "chai";

// Test ricevente: mostra IP/porta pubblici e attende un pacchetto da chiunque

describe("SHSP Receiver", function () {
  let handler: StunHandler;
  let socket: any;

  before(async function () {
    this.timeout(20000);
    handler = new StunHandler();
    socket = handler.getSocket();
  });

  it("Should perform STUN request and log public IP/port", async function () {
    const stunRes = await handler.performStunRequest();
    console.log("[RECEIVER] Public IP:", stunRes.publicIp, "Public Port:", stunRes.publicPort);
    expect(stunRes).to.have.property("publicIp");
    expect(stunRes).to.have.property("publicPort");
  });

  it("Should wait for a packet from anyone", function (done) {
    console.log("[RECEIVER] Waiting for a packet on:", socket.address());
    socket.on("message", (msg: Buffer, rinfo: any) => {
      console.log("[RECEIVER] Received:", msg.toString(), "from", rinfo.address, rinfo.port);
      done();
    });
  });
});
