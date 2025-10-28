import { IShspSocket } from "@shsp/interfaces/index";
import { expect } from "chai";


export function testSocketPair(
  socketA: IShspSocket,
  socketB: IShspSocket,
  portA: number,
  portB: number
) {
  describe('IShspSocket Pair Test', function () {


    it('Should send from A to B and receive', function (done) {
      const message = Buffer.from('Hello from A to B!');
      socketB.on('message', (msg, rinfo) => {
        console.log('[PAIR TEST] B received:', msg.toString(), rinfo);
        expect(msg.toString()).to.equal('Hello from A to B!');
        done();
      });
      socketA.send(message, 0, message.length, portB, '127.0.0.1', (err) => {
        if (err) return done(err);
        console.log('[PAIR TEST] A sent:', message.toString(), 'to', '127.0.0.1', portB);
      });
    });

    it('Should send from B to A and receive', function (done) {
      const message = Buffer.from('Hello from B to A!');
      socketA.on('message', (msg, rinfo) => {
        console.log('[PAIR TEST] A received:', msg.toString(), rinfo);
        expect(msg.toString()).to.equal('Hello from B to A!');
        done();
      });
      socketB.send(message, 0, message.length, portA, '127.0.0.1', (err) => {
        if (err) return done(err);
        console.log('[PAIR TEST] B sent:', message.toString(), 'to', '127.0.0.1', portA);
      });
    });

    after(function () {
      socketA.close();
      socketB.close();
    });
  });
}

// Esempio di utilizzo:
// testSingleShspSocket(async () => ({ handler: /* crea e ritorna il tuo handler qui */ }));
// import { createSocket } from '@shsp/implementations';
// testSocketPair(createSocket('udp4'), createSocket('udp4'), 50000, 50001);