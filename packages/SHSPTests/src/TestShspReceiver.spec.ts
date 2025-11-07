import { IShspSocket } from "@shsp/interfaces/index";
import { expect } from "chai";
import { askRemoteInfo, sendMultiplePackets } from "./testUtils";

export function testReceiver(socket: IShspSocket, port: number, stunHandler?: any) {
  describe("SHSP Receiver", function () {
    before(async function() {
      if (stunHandler) {
        await stunHandler.performStunRequest();
        console.log("[RECEIVER] STUN request completed");
      }
    });

    it("Should log local address, send 5 packets, and wait for a packet", async function () {
      this.timeout(120000); // 2 minutes timeout
      console.log("[RECEIVER] Local address:", socket.address());

      // Wait for incoming message (resolve when received)
      const waitForMessage = new Promise<void>((resolve) => {
        socket.on("message", (msg: Buffer, rinfo: any) => {
          console.log("[RECEIVER] Received:", msg.toString(), "from", rinfo.address, rinfo.port);
          expect(msg).to.be.instanceOf(Buffer);
          resolve();
        });
      });
      console.log("[RECEIVER] Waiting for incoming message...");

      const { ip, remotePort } = await askRemoteInfo();
      if (!ip || !remotePort) {
        console.warn("[RECEIVER] IP o porta non validi, skipping send test");
        return;
      }

      await sendMultiplePackets(socket, ip, remotePort, "RECEIVER", 5, 20000);
      await waitForMessage;
    });

    it("Should close the socket", function () {
      socket.close();
    });
  });
}

// Esempio di utilizzo:
// import { createShspSocket } from '@shsp/implementations';
// testReceiver(createShspSocket('udp4'), 50001);
