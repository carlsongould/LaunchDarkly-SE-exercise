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

const customerId =
  new URLSearchParams(window.location.search).get("customer") ??
  "customer-123";

const customers: Record<string, LDContext> = {
  "customer-123": {
    kind: "user",
    key: "customer-123",
    name: "Jane Smith",
    plan: "standard",
    country: "US",
  },

  "customer-456": {
    kind: "user",
    key: "customer-456",
    name: "John Doe",
    plan: "enterprise",
    country: "US",
  },

  "customer-789": {
    kind: "user",
    key: "customer-789",
    name: "Alex Johnson",
    plan: "standard",
    country: "CA",
  },
};

export const customerContext =
  customers[customerId] ?? customers["customer-123"];

export const ldClient: LDClient = initialize(
  clientId,
  customerContext
);
