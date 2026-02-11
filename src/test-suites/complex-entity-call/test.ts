import { createTest } from "../../testkit.js";

export default [
  // Test complex multi-entity resolution with nested relationships
  // Verifies that complex entity graphs can be resolved across multiple subgraphs
  // - topProducts query involves multiple entity types: Product, Category, Price
  // - Tests circular relationships: Category -> mainProduct -> Category
  // - Validates that nested entity resolution works correctly
  // - price field uses object wrapper pattern
  // - category.mainProduct creates a circular reference back to Product
  // This represents real-world complex data relationships in federated systems
  createTest(
    /* GraphQL */ `
      query {
        topProducts {
          products {
            id
            pid
            price {
              price
            }
            category {
              mainProduct {
                id
              }
              id
              tag
            }
          }
          selected {
            id
          }
          first {
            id
          }
        }
      }
    `,
    {
      data: {
        topProducts: {
          products: [
            {
              id: "1",
              pid: "p1",
              price: {
                price: 100,
              },
              category: {
                mainProduct: {
                  id: "1",
                },
                id: "c1",
                tag: "t1",
              },
            },
            {
              id: "2",
              pid: "p2",
              price: {
                price: 200,
              },
              category: {
                mainProduct: {
                  id: "2",
                },
                id: "c2",
                tag: "t2",
              },
            },
          ],
          selected: {
            id: "2",
          },
          first: {
            id: "1",
          },
        },
      },
    },
  ),
];
