import { StunHandler } from "@shsp/implementations/index";
import { testReceiver } from "../TestShspReceiver.spec";

const handler = new StunHandler();
const socket = handler.getSocket();

socket.bind(50000);
testReceiver(socket, 50000);
