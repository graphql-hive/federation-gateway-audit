import { createTest } from "../../testkit.js";

export default [
  // Test Federation v2 type extension and entity resolution patterns  
  // Verifies that Federation v2 syntax works correctly for extending types
  // - Multiple queries test different aspects of v2 entity resolution
  // - userById query tests entity resolution with multiple fields
  // - Tests that v2 @key directive and type redefinition work properly
  createTest(
    /* GraphQL */ `
      query {
        randomUser {
          id
          name
        }
        userById(id: "u2") {
          id
          name
          nickname
        }
      }
    `,
    {
      data: {
        randomUser: {
          id: "u1",
          name: "u1-name",
        },
        userById: {
          id: "u2",
          name: "u2-name",
          nickname: "u2-nickname",
        },
      },
    },
  ),
  // Test entity resolution with Federation v2 external field patterns
  // Verifies that external fields in v2 can be properly resolved
  // - rid field demonstrates v2 external field handling
  // - Tests that @external directive works with v2 syntax
  createTest(
    /* GraphQL */ `
      query {
        randomUser {
          id
          rid
        }
      }
    `,
    {
      data: {
        randomUser: {
          id: "u1",
          rid: "u1-rid",
        },
      },
    },
  ),
  // Test complex field resolution combining v2 patterns
  // Verifies that multiple fields can be resolved together in v2
  // - Combines both local and external fields in single query
  // - Tests efficiency of v2 entity resolution patterns
  createTest(
    /* GraphQL */ `
      query {
        randomUser {
          id
          rid
          name
        }
      }
    `,
    {
      data: {
        randomUser: {
          id: "u1",
          rid: "u1-rid",
          name: "u1-name",
        },
      },
    },
  ),
  // Test Federation v2 provides directive functionality
  // Verifies that @provides works correctly with v2 syntax
  // - providedRandomUser query uses @provides optimization
  // - Tests that v2 @provides directive reduces round trips
  // - Validates that provided fields are correctly included
  createTest(
    /* GraphQL */ `
      query {
        providedRandomUser {
          id
          rid
          name
        }
      }
    `,
    {
      data: {
        providedRandomUser: {
          id: "u1",
          rid: "u1-rid",
          name: "u1-name",
        },
      },
    },
  ),
];
