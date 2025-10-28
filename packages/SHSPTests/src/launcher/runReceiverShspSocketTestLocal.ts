import { createShspSocket } from "@shsp/implementations/index";
import { testReceiver } from "../TestShspReceiver.spec";

const socket = createShspSocket('udp4');

socket.bind(50000);
testReceiver(socket, 50000);
