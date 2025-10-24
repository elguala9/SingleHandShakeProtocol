import { testIStunHandler } from "../TestStunHandler.spec";
import { StunHandler } from "@shsp/implementations/index";

testIStunHandler(async () => {
  // Qui puoi istanziare e configurare lo StunHandler come necessario
  const handler = new StunHandler();
  return { handler };
});
