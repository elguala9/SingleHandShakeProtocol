import { IShspPeer } from "@shsp/interfaces/index";
import { expect } from "chai";

export function testPeerPair(peerA: IShspPeer, peerB: IShspPeer): void {
  describe("IShspPeer Pair Test", function () {
    it("should deliver payload from peerA to peerB via setMessageCallback", function (done) {
      const payload = Buffer.from("hello from peerA");

      peerB.setMessageCallback((msg, info) => {
        expect(msg.toString()).to.equal(payload.toString());
        expect(info.address).to.be.a("string");
        expect(info.port).to.be.a("number");
        done();
      });

      peerA.sendMessage(payload);
    });

    it("should deliver payload from peerB to peerA via setMessageCallback", function (done) {
      const payload = Buffer.from("hello from peerB");

      peerA.setMessageCallback((msg, info) => {
        expect(msg.toString()).to.equal(payload.toString());
        expect(info.address).to.be.a("string");
        expect(info.port).to.be.a("number");
        done();
      });

      peerB.sendMessage(payload);
    });

    it("should serialize remote peer information", function () {
      const serialized = peerA.serializedObject();
      const parsed = JSON.parse(serialized);

      expect(parsed).to.have.property("remoteIp").that.is.a("string");
      expect(parsed).to.have.property("remotePort").that.is.a("number");
      expect(parsed).to.have.property("socket").that.is.a("string");
    });

    after(function () {
      (peerA as any).close?.();
      (peerB as any).close?.();
    });
  });
}
