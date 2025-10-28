import { StunHandler } from "@shsp/implementations/index";
import { testSender } from "../TestShspSender.spec";



const handler = new StunHandler({localPort: 50001});
const socket = handler.getSocket();
testSender(socket, 50001, handler);

