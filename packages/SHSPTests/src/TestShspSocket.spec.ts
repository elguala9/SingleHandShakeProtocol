import { formatAddressStun } from "@shsp/implementations/index";
import { IShspSocket, IStunHandler } from "@shsp/interfaces/index";
import { expect } from "chai";

export function testIShspSocket(
  f: () => Promise<{ 
    handler_0: IStunHandler,
    handler_1: IStunHandler
   }>
) {
  let handler_0: IStunHandler;
  let handler_1: IStunHandler;
  let socket_0: IShspSocket;
  let socket_1: IShspSocket;

  describe('IShspSocket Tests', function () {
    before(async function () {
      this.timeout(20000);
      let x = await f();
      handler_0 = x.handler_0;
      handler_1 = x.handler_1;
    });

    it('Should create both sockets', function (done) {
      
      socket_0 = handler_0.getSocket();
      socket_1 = handler_1.getSocket();
      done();
    });

    it('Should send and receive messages using message callbacks', async function (done) {
      const message = Buffer.from('Hello, World!');
      let res_socket_0 = await handler_0.performStunRequest();
      let res_socket_1 = await handler_1.performStunRequest();

      // Log info di bind e STUN
      console.log('[DEBUG] socket_0 bind:', socket_0.address());
      console.log('[DEBUG] socket_1 bind:', socket_1.address());
      console.log('[DEBUG] res_socket_0 STUN:', res_socket_0);
      console.log('[DEBUG] res_socket_1 STUN:', res_socket_1);

      // Log chiavi
      const key_callback = formatAddressStun(res_socket_0);
      const key_send = formatAddressStun(res_socket_1);
      console.log('[DEBUG] key_callback (usata per setMessageCallback):', key_callback);
      console.log('[DEBUG] key_send (usata per send):', key_send);

      // DEBUG: intercetta tutti i messaggi su socket_1
      socket_1.on('message', (msg, rinfo) => {
        console.debug('[DEBUG] socket_1 received:', msg.toString(), rinfo, 'key:', rinfo.address + ':' + rinfo.port);
      });

      socket_1.setMessageCallback(key_callback, (msg: Buffer, rinfo) => {
        console.log('[DEBUG] setMessageCallback triggered:', msg.toString(), rinfo, 'key:', rinfo.address + ':' + rinfo.port);
        try {
          expect(msg.toString()).to.equal('Hello, World!');
          done();
        } catch (err) {
          done(err);
        }
      });

      socket_0.send(message, 0, message.length, res_socket_1.publicPort, res_socket_1.publicIp);
      console.log('[DEBUG] socket_0 sent:', message.toString(), 'to', res_socket_1.publicIp, res_socket_1.publicPort);
    });



    it("Close everything", function (done) {
      handler_0.close();
      handler_1.close();
      done();
    });
  });

}