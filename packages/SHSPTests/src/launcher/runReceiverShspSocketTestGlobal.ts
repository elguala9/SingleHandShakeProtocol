

import { StunHandler } from "@shsp/implementations/index";
import { testReceiver } from "../TestShspReceiver.spec";


async function main() {
	const handler = new StunHandler({localPort: 50000});
	const socket = handler.getSocket();
	await handler.performStunRequest();
	console.log("STUN request completed");
	testReceiver(socket, 50000);
}

main();
