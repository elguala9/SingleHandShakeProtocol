import { IShspSocket, IStunHandler } from "@shsp/interfaces/index";
import { expect } from "chai";
import readline from "node:readline";

export function testSingleShspSocket(
  f: () => Promise<{ handler: IStunHandler }>
) {
  let handler: IStunHandler;
  let socket: IShspSocket;
  let remoteIp = "";
  let remotePort = 0;

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

    it('Should ask for remote IP and port, then send message', function (done) {
      askRemoteInfo().then(({ ip, port }) => {
        remoteIp = ip;
        remotePort = port;
        if (!remoteIp || !remotePort) {
          console.warn('[TEST] IP o porta non validi, skipping send test');
          return done();
        }
        const message = Buffer.from('Hello from single peer!');
        socket.send(message, 0, message.length, remotePort, remoteIp, (err) => {
          if (err) return done(err);
          console.log('[TEST] Sent message to', remoteIp, remotePort);
          done();
        });
      });
    });

    function askRemoteInfo(): Promise<{ ip: string; port: number }> {
      return new Promise((resolve) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question('Inserisci IP del peer remoto: ', (ip) => {
          rl.question('Inserisci porta del peer remoto: ', (portStr) => {
            rl.close();
            resolve({ ip: ip.trim(), port: Number(portStr.trim()) });
          });
        });
      });
    }
  });
}

// Esempio di utilizzo:
// testSingleShspSocket(async () => ({ handler: /* crea e ritorna il tuo handler qui */ }));