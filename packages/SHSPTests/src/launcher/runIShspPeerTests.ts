import { ShspPeer, createShspSocket } from "@shsp/implementations/index";
import { testPeerPair } from "../TestShspPeer.spec";

const portA = 55000;
const portB = 55001;
const localAddress = "127.0.0.1";

const socketA = createShspSocket("udp4");
const socketB = createShspSocket("udp4");

before(async function () {
  await Promise.all([
    new Promise<void>((resolve, reject) => {
      socketA.once("error", reject);
      socketA.once("listening", () => resolve());
      socketA.bind(portA);
    }),
    new Promise<void>((resolve, reject) => {
      socketB.once("error", reject);
      socketB.once("listening", () => resolve());
      socketB.bind(portB);
    }),
  ]);
});

const peerA = new ShspPeer(localAddress, portB, socketA);
const peerB = new ShspPeer(localAddress, portA, socketB);

testPeerPair(peerA, peerB);
