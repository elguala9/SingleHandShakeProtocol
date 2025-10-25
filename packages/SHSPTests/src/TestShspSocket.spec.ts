import { IShspSocket, IStunHandler } from "@shsp/interfaces/index";
import { expect } from "chai";

// Leggi IP e porta remoti dai parametri CLI
const args = process.argv.slice(2);
const REMOTE_IP = args[0] || "";
const REMOTE_PORT = args[1] ? Number(args[1]) : 0;

export function testSingleShspSocket(
  f: () => Promise<{ handler: IStunHandler }>
) {
  let handler: IStunHandler;
  let socket: IShspSocket;

  describe('Single IShspSocket Peer Test', function () {
    before(async function () {
      this.timeout(20000);
      let x = await f();
      handler = x.handler;
      socket = handler.getSocket();
    });

    it('Should bind and log local info', async function () {
      const localInfo = await handler.performLocalRequest();
      console.log('[TEST] Local info:', localInfo);
      expect(localInfo).to.have.property('localIp');
      expect(localInfo).to.have.property('localPort');
    });

    it('Should receive messages from remote peer', function (done) {
      socket.on('message', (msg, rinfo) => {
        console.log('[TEST] Received message:', msg.toString(), rinfo);
        done();
      });
    });

    it('Should send message to remote peer', function (done) {
      if (!REMOTE_IP || !REMOTE_PORT) {
        console.warn('[TEST] REMOTE_IP or REMOTE_PORT not set, skipping send test');
        return done();
      }
      const message = Buffer.from('Hello from single peer!');
      socket.send(message, 0, message.length, REMOTE_PORT, REMOTE_IP, (err) => {
        if (err) return done(err);
        console.log('[TEST] Sent message to', REMOTE_IP, REMOTE_PORT);
        done();
      });
    });
  });
}

// Esempio di utilizzo:
// testSingleShspSocket(async () => ({ handler: /* crea e ritorna il tuo handler qui */ }));