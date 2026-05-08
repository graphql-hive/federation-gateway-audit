import { createTest } from "../../testkit.js";

// Every query in this file is engineered around a single invariant:
//
//   When a subgraph declares `@provides(fields: "X Y")`, the gateway MUST
//   forward only the subset of {X, Y, ...} the CLIENT actually selected,
//   never the full @provides set.
//
// `b` declares `@provides(fields: "name description")`. None of the client
// queries below select `description`, so a correct gateway will never ask
// `b` for it. A buggy gateway that injects every @provides field will
// trigger `b.Entity.description`, which throws in punish mode, bubbles up
// the non-null `description` to its parent, and turns the response into
// `{ entity: null }` plus an error.
export default [
  // Baseline: only the @key field is selected. The gateway should still
  // route through `b` (no fields are required from `a` here), and it must
  // not over-forward `name` or `description`.
  createTest(
    /* GraphQL */ `
      query {
        entity {
          id
        }
      }
    `,
    {
      data: {
        entity: {
          id: "e1",
        },
      },
    },
  ),
  // The exact scenario reported by the user: client asks `id name`, gateway
  // must NOT also ask the provider for `description`.
  createTest(
    /* GraphQL */ `
      query {
        entity {
          id
          name
        }
      }
    `,
    {
      data: {
        entity: {
          id: "e1",
          name: "Entity One",
        },
      },
    },
  ),
  // Same shape but with an alias - the per-path injection logic must
  // preserve the alias when restricting the provided selection.
  createTest(
    /* GraphQL */ `
      query {
        entity {
          id
          displayName: name
        }
      }
    `,
    {
      data: {
        entity: {
          id: "e1",
          displayName: "Entity One",
        },
      },
    },
  ),
  // Inline fragment over the same concrete type. The injection path stack
  // walks through the fragment and must not lose the original selection.
  createTest(
    /* GraphQL */ `
      query {
        entity {
          id
          ... on Entity {
            name
          }
        }
      }
    `,
    {
      data: {
        entity: {
          id: "e1",
          name: "Entity One",
        },
      },
    },
  ),
  // Named fragment - same constraint as the inline-fragment case.
  createTest(
    /* GraphQL */ `
      query {
        entity {
          id
          ...EntityName
        }
      }

      fragment EntityName on Entity {
        name
      }
    `,
    {
      data: {
        entity: {
          id: "e1",
          name: "Entity One",
        },
      },
    },
  ),
  // Mixed plan: `name` comes from `b` via @provides, `extra` forces a
  // fallback hop to the owner `a`. The gateway must NOT over-forward
  // `description` to `b`, and must NOT ask `a` for `name` (since `b`
  // already provided it).
  createTest(
    /* GraphQL */ `
      query {
        entity {
          id
          name
          extra
        }
      }
    `,
    {
      data: {
        entity: {
          id: "e1",
          name: "Entity One",
          extra: "Extra One",
        },
      },
    },
  ),
  // List variant - the same invariant applies once per element. A buggy
  // gateway that injects @provides fields per visit would trigger the
  // throw on every entity, not just the first.
  createTest(
    /* GraphQL */ `
      query {
        entities {
          id
          name
        }
      }
    `,
    {
      data: {
        entities: [
          {
            id: "e1",
            name: "Entity One",
          },
          {
            id: "e2",
            name: "Entity Two",
          },
        ],
      },
    },
  ),
  // List variant with the owner-fallback hop - confirms the per-element
  // join still works without over-forwarding.
  createTest(
    /* GraphQL */ `
      query {
        entities {
          id
          name
          extra
        }
      }
    `,
    {
      data: {
        entities: [
          {
            id: "e1",
            name: "Entity One",
            extra: "Extra One",
          },
          {
            id: "e2",
            name: "Entity Two",
            extra: "Extra Two",
          },
        ],
      },
    },
  ),
  // `@skip(if: true)` on the wrapping inline fragment must be preserved end
  // to end. If the gateway drops the directive while rewriting the query for
  // the providing subgraph, it would unconditionally fetch `description`
  // there - which trips the throwing resolver and bubbles `entity` to null.
  createTest(
    /* GraphQL */ `
      query {
        entity {
          id
          ... on Entity @skip(if: true) {
            description
          }
        }
      }
    `,
    {
      data: {
        entity: {
          id: "e1",
        },
      },
    },
  ),
  // Same invariant via `@include(if: false)` - the equivalent way of
  // opting out of a `@provides` field. The directive must still reach the
  // providing subgraph intact.
  createTest(
    /* GraphQL */ `
      query {
        entity {
          id
          ... on Entity @include(if: false) {
            description
          }
        }
      }
    `,
    {
      data: {
        entity: {
          id: "e1",
        },
      },
    },
  ),
  // Multiple sibling *untyped* inline fragments under the same field. They
  // all share the same path in the original document, so the gateway must
  // walk every one when figuring out which @provides fields the client
  // actually selected. A shallow walk that only considers the first sibling
  // would either drop the other selections or over-forward to recover them.
  createTest(
    /* GraphQL */ `
      query {
        entity {
          id
          ... {
            name
          }
          ... {
            extra
          }
        }
      }
    `,
    {
      data: {
        entity: {
          id: "e1",
          name: "Entity One",
          extra: "Extra One",
        },
      },
    },
  ),
];
