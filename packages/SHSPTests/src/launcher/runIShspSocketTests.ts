import { testSingleShspSocket } from "../TestShspSocket.spec";
import { StunHandler } from "@shsp/implementations/index";

testSingleShspSocket(async () => {
  // Istanzia e configura il handler come necessario
  const handler = new StunHandler();
  return { handler };
});
