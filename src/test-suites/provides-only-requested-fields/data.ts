// The bug this suite covers (gateway over-forwarding @provides fields the
// client never asked for, plus re-delegating to the owner subgraph for
// @provides-covered fields) can only be observed through subgraph-level
// errors when the gateway asks for fields it shouldn't. Those throws are
// gated behind `PUNISH_FOR_POOR_PLANS=1` (see `src/env.ts`) so the default
// audit run remains a pure data-correctness check, while gateway authors
// can flip the env flag to lock down the spec-correct behavior.
export const entities = [
  {
    id: "e1",
    name: "Entity One",
    description: "Description One",
    extra: "Extra One",
  },
  {
    id: "e2",
    name: "Entity Two",
    description: "Description Two",
    extra: "Extra Two",
  },
];
