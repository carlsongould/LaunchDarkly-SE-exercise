import {
  initialize,
  type LDClient,
  type LDContext,
} from "launchdarkly-js-client-sdk";

const clientId = import.meta.env.VITE_LD_CLIENT_ID;

if (!clientId) {
  throw new Error(
    "Missing VITE_LD_CLIENT_ID. Add your LaunchDarkly Client-side ID to .env."
  );
}

export const customerContext: LDContext = {
  kind: "user",
  key: "Acme Tools",
  name: "Jane Smith",
  plan: "enterprise",
};

export const ldClient: LDClient = initialize(
  clientId,
  customerContext
);
