import { createTest } from "../../testkit.js";

export default [
  // Test handling of null values in entity key fields
  // Verifies that the gateway correctly handles entities with null relationships
  // - bookContainers query returns a list with some null author relationships
  // - Tests that entity resolution gracefully handles null foreign keys
  // - Ensures that null values don't break the federated query execution
  // This is important for real-world scenarios where relationships may be optional
  createTest(
    /* GraphQL */ `
      query {
        bookContainers {
          book {
            upc
            author {
              name
            }
          }
        }
      }
    `,
    {
      data: {
        bookContainers: [
          {
            book: {
              upc: "b1",
              author: {
                name: "Alice",
              },
            },
          },
          {
            book: {
              upc: "b2",
              author: {
                name: "Bob",
              },
            },
          },
          {
            book: {
              upc: "b3",
              author: null,
            },
          },
        ],
      },
    },
  ),
];
