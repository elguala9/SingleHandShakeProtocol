import { StunHandler } from "@shsp/implementations/index";
import { testSender } from "../TestShspSender.spec";


async function main() {
	const handler = new StunHandler({localPort: 50001});
	const socket = handler.getSocket();
	await handler.performStunRequest();
	console.log("STUN request completed");
	testSender(socket, 50001);
}

main();
