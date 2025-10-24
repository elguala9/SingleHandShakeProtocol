import { testIShspSocket } from "../TestShspSocket.spec";
import { StunHandler } from "@shsp/implementations/index";

testIShspSocket(async () => {
  // Istanzia e configura i due handler come necessario
  const handler_0 = new StunHandler();
  const handler_1 = new StunHandler({ localPort: 50000 });
  return { handler_0, handler_1 };
});
