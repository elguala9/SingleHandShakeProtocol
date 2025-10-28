

import { StunHandler } from "@shsp/implementations/index";
import { testReceiver } from "../TestShspReceiver.spec";



const handler = new StunHandler({localPort: 50000});
const socket = handler.getSocket();
testReceiver(socket, 50000, handler);

