import { Beneficiary } from "./Beneficiary.model";
import { LastWill } from "./LastWill";
import { RevocableLivingTrust } from "./RevocableLivingTrust";
import { RevocableLivingTrustExecutionInstructions } from "./RevocableLivingTrustExecutionInstructions";
import { RevocableLivingTrustFundingInstructions } from "./RevocableLivingTrustFundingInstructions";
import { TrustData } from "./TrustData";

export interface ClientData {
    trust?: TrustData;
    revocable_living_trust?: RevocableLivingTrust;
    revocable_living_trust_execution_instructions?: RevocableLivingTrustExecutionInstructions;
    revocable_living_trust_funding_instructions?: RevocableLivingTrustFundingInstructions;
    last_will?: LastWill;
    beneficiary? : Beneficiary
  }