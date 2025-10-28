import { createShspSocket } from "@shsp/implementations/index";
import { testSender } from "../TestShspSender.spec";

const socket = createShspSocket('udp4');

socket.bind(50001);
testSender(socket, 50001);
