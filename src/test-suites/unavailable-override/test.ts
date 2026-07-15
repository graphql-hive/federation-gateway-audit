import { createTest } from "../../testkit.js";

export default [
  // Test @override directive with non-existing source subgraph
  // Verifies that @override gracefully handles references to non-existent subgraphs
  // - Subgraph B tries to override from "non-existing" subgraph
  // - Tests that the gateway handles invalid @override references without breaking
  // - Should fall back to normal field resolution when override source doesn't exist
  createTest(
    /* GraphQL */ `
      query {
        feed {
          createdAt
        }
      }
    `,
    {
      data: {
        feed: [
          {
            createdAt: "p1-createdAt",
          },
          {
            createdAt: "p2-createdAt",
          },
        ],
      },
    },
  ),
  // Test that invalid @override doesn't affect multiple query sources
  // Verifies consistent behavior across different query entry points
  // - Both aFeed and bFeed should work normally despite invalid override
  // - Tests resilience of the gateway when schema contains invalid @override references
  createTest(
    /* GraphQL */ `
      query {
        aFeed {
          createdAt
        }
        bFeed {
          createdAt
        }
      }
    `,
    {
      data: {
        aFeed: [
          {
            createdAt: "p2-createdAt",
          },
        ],
        bFeed: [
          {
            createdAt: "p1-createdAt",
          },
        ],
      },
    },
  ),
];
