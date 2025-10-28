import { createShspSocket } from "@shsp/implementations/index";
import { testSocketPair } from "../TestShspSocket.spec";
const socketA = createShspSocket('udp4');
const socketB = createShspSocket('udp4');

testSocketPair(
  socketA,
  socketB,
  50000,
  50001
);
