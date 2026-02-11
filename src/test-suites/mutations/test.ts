import { createTest } from "../../testkit.js";

export default () => {
  const randomId = Math.random().toString(16).substr(2);

  return [
    // Test mutations that modify data and resolve entity fields across subgraphs
    // Verifies that a product can be added and its computed fields are resolved correctly
    // - addProduct mutation creates a new product in subgraph A
    // - isExpensive field is computed in subgraph B using @requires(fields: "price")
    // - isAvailable field is provided by subgraph B
    createTest(
      /* GraphQL */ `
        mutation {
          addProduct(input: { name: "new", price: 599.99 }) {
            name
            price
            isExpensive
            isAvailable
          }
        }
      `,
      {
        data: {
          addProduct: {
            name: "new",
            price: 599.99,
            isExpensive: true,
            isAvailable: true,
          },
        },
      },
    ),
    // Test querying existing products with cross-subgraph field resolution
    // Verifies that entity resolution works correctly for existing data
    // - product query fetches from subgraph A (name, price)
    // - isExpensive computed in subgraph B using @requires(fields: "price")
    // - isAvailable provided by subgraph B
    createTest(
      /* GraphQL */ `
        query {
          product(id: "p1") {
            id
            name
            price
            isExpensive
            isAvailable
          }
        }
      `,
      {
        data: {
          product: {
            id: "p1",
            name: "p1-name",
            price: 9.99,
            isExpensive: false,
            isAvailable: true,
          },
        },
      },
    ),
    // Test correct order of execution for sequential mutations
    // Verifies that mutations execute in the specified order across subgraphs
    // This tests mutation sequencing to maintain data consistency
    // - add(5) -> 5, multiply(2) -> 10, add(2) -> 12, delete() -> 12
    // It demonstrates that mutations with shared state execute in sequence
    createTest(
      /* GraphQL */ `
      mutation {
        five: add(num: 5, requestId: "${randomId}")
        ten: multiply(by: 2, requestId: "${randomId}")
        twelve: add(num: 2, requestId: "${randomId}")
        final: delete(requestId: "${randomId}")
      }
    `,
      {
        data: {
          five: 5,
          ten: 10,
          twelve: 12,
          final: 12,
        },
      },
    ),
    // Test @shareable mutations across multiple subgraphs
    // Verifies that the same mutation can be defined in multiple subgraphs
    // and the gateway correctly routes to the appropriate implementation
    // - addCategory is marked @shareable in both subgraphs A and B
    createTest(
      /* GraphQL */ `
        mutation {
          addCategory(name: "new", requestId: "${randomId}") {
            id
            name
          }
        }
      `,
      {
        data: {
          addCategory: {
            id: "c-added-" + randomId,
            name: "new",
          },
        },
      },
    ),
  ];
};
