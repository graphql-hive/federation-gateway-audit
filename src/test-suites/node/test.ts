import { createTest } from "../../testkit.js";

export default [
  // Test Node interface pattern with inline fragments
  // Verifies that the Node interface (common pattern in GraphQL) works in federation
  // - productNode query returns a Node interface that resolves to Product type
  // - Tests inline fragment selection on concrete type
  // - Validates __typename field resolution within fragments
  // This pattern is commonly used for Relay-style pagination and global object identification
  createTest(
    /* GraphQL */ `
      {
        productNode {
          ... on Product {
            id
            name
            __typename
            price
          }
        }
      }
    `,
    {
      data: {
        productNode: {
          id: "p-1",
          name: "Product 1",
          __typename: "Product",
          price: 10,
        },
      },
    },
  ),
];
