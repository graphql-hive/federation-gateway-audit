import { createTest } from "../../testkit.js";

export default [
  // Test Federation v1 @external and @extends directives working together
  // Verifies that a type can be extended using @extends and resolve fields
  // that depend on @external fields from the original definition
  // - productInA query returns a Product that spans multiple subgraphs
  // - Tests that Federation v1 patterns still work correctly
  // - Validates that @external fields can be used for entity resolution
  createTest(
    /* GraphQL */ `
      query {
        productInA {
          id
          pid
          price
          upc
          name
        }
      }
    `,
    {
      data: {
        productInA: {
          id: "p1",
          pid: "p1-pid",
          price: 12.3,
          upc: "upc1",
          name: "p1-name",
        },
      },
    },
  ),
];
