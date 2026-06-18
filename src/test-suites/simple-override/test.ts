import { createTest } from "../../testkit.js";

export default [
  // Test basic @override directive functionality
  // Verifies that subgraph B can override the createdAt field from subgraph A
  // - Both subgraphs define the same feed query and Post type
  // - Subgraph B uses @override(from: "a") to take ownership of createdAt field
  // - Tests that the gateway routes field resolution to the overriding subgraph
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
  // Test that @override works with different query entry points
  // Verifies that field override behavior is consistent across different queries
  // - aFeed and bFeed are subgraph-specific queries returning different posts
  // - Both should use the overridden createdAt field resolution from subgraph B
  // - Tests that @override directive affects field resolution regardless of query source
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
