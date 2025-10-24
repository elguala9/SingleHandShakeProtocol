import { expect } from "chai";
import { IStunHandler } from "@shsp/interfaces/index";

export function testIStunHandler(
  f: () => Promise<{ handler: IStunHandler }>
) {
  let handler: IStunHandler;

  describe('IStunHandler Tests', function () {
    before(async function () {
      this.timeout(20000);
      let x = await f();
      handler = x.handler;
    });

    it('Should perform a STUN request and return a valid response', async function () {
      this.timeout(10000);
      const res = await handler.performStunRequest();
      console.log('[TEST] STUN response:', res);
      expect(res).to.have.property('publicIp');
      expect(res).to.have.property('publicPort');
      expect(res).to.have.property('transactionId');
      expect(res).to.have.property('raw');
      expect(res).to.have.property('attrs');
    });

    it('Should ping the STUN server successfully', async function () {
      this.timeout(10000);
      const result = await handler.pingStunServer();
      expect(result).to.be.a('boolean');
    });

    it('Should close the socket without error', function (done) {
      // @ts-ignore: getSocket is implemented in StunHandler
      const socket = handler.getSocket();
      let closed = false;
      socket.once('close', () => {
        closed = true;
      });
      socket.close();
      setTimeout(() => {
        expect(closed).to.be.true;
        done();
      }, 100);
    });
  });
}
