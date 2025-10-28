import { IShspSocket } from "@shsp/interfaces/index";
import { expect } from "chai";

export function testReceiver(socket: IShspSocket, port: number) {
  describe("SHSP Receiver", function () {

    it("Should log local address and wait for a packet", function (done) {
      console.log("[RECEIVER] Local address:", socket.address());
      socket.on("message", (msg: Buffer, rinfo: any) => {
        console.log("[RECEIVER] Received:", msg.toString(), "from", rinfo.address, rinfo.port);
        expect(msg).to.be.instanceOf(Buffer);
        done();
      });
    });

    it("Should close the socket", function () {
      socket.close();
    });
  });
}

// Esempio di utilizzo:
// import { createShspSocket } from '@shsp/implementations';
// testReceiver(createShspSocket('udp4'), 50001);
