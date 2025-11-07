import { IShspSocket } from "@shsp/interfaces/index";
import { askRemoteInfo, sendMultiplePackets } from "./testUtils";

export function testSender(socket: IShspSocket, port: number, stunHandler?: any) {
  describe("SHSP Sender", function () {
    before(async function() {
      if (stunHandler) {
        await stunHandler.performStunRequest();
        console.log("[SENDER] STUN request completed");
      }
    });

    it("Should log local address and send 5 packets, one every 20 seconds", async function () {
      this.timeout(120000); // 2 minutes timeout
      console.log("[SENDER] Local address:", socket.address());
      
      const { ip, remotePort } = await askRemoteInfo();
      if (!ip || !remotePort) {
        console.warn("[SENDER] IP o porta non validi, skipping send test");
        return;
      }
      
      await sendMultiplePackets(socket, ip, remotePort, "SENDER", 5, 20000);
    });

    it("Should close the socket", function () {
      socket.close();
    });
  });
}

// Esempio di utilizzo:
// import { createShspSocket } from '@shsp/implementations';
// testSender(createShspSocket('udp4'), 50000);
