import { StunHandler } from "@shsp/implementations/index";
import { testSender } from "../TestShspSender.spec";

const handler = new StunHandler();
const socket = handler.getSocket();

socket.bind(50001);
testSender(socket, 50001);
