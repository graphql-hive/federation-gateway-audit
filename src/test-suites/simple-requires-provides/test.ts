import { createTest } from "../../testkit.js";

export default [
  // Test basic user query without any cross-subgraph resolution
  // Verifies simple field access from the accounts subgraph
  createTest(
    /* GraphQL */ `
      query {
        me {
          id
        }
      }
    `,
    {
      data: {
        me: {
          id: "u1",
        },
      },
    },
  ),
  // Test basic entity resolution across subgraphs
  // Verifies that user reviews can be resolved from the reviews subgraph
  // - me query from accounts subgraph
  // - reviews field resolved through User entity key in reviews subgraph
  createTest(
    /* GraphQL */ `
      query {
        me {
          id
          reviews {
            id
          }
        }
      }
    `,
    {
      data: {
        me: {
          id: "u1",
          reviews: [
            {
              id: "r1",
            },
            {
              id: "r2",
            },
          ],
        },
      },
    },
  ),
  // Test @provides directive functionality
  // Verifies that the reviews subgraph can provide the username field
  // - Review.author field uses @provides(fields: "username")
  // - This avoids an extra round-trip to the accounts subgraph for username
  // - Tests that provided fields are correctly included in the response
  createTest(
    /* GraphQL */ `
      query {
        me {
          reviews {
            id
            author {
              id
              username
            }
            product {
              inStock
            }
          }
        }
      }
    `,
    {
      data: {
        me: {
          reviews: [
            {
              id: "r1",
              author: {
                id: "u1",
                username: "u-username-1",
              },
              product: {
                inStock: true,
              },
            },
            {
              id: "r2",
              author: {
                id: "u1",
                username: "u-username-1",
              },
              product: {
                inStock: false,
              },
            },
          ],
        },
      },
    },
  ),
  // Test basic product name query from products subgraph
  // Verifies simple field access without cross-subgraph dependencies
  createTest(
    /* GraphQL */ `
      query {
        products {
          name
        }
      }
    `,
    {
      data: {
        products: [
          {
            name: "p-name-1",
          },
          {
            name: "p-name-2",
          },
        ],
      },
    },
  ),
  // Test basic product price query from products subgraph
  // Verifies access to price field without dependencies
  createTest(
    /* GraphQL */ `
      query {
        products {
          price
        }
      }
    `,
    {
      data: {
        products: [
          {
            price: 11,
          },
          {
            price: 22,
          },
        ],
      },
    },
  ),
  // Test @requires directive functionality
  // Verifies that shippingEstimate field can be computed using required fields
  // - shippingEstimate field in inventory subgraph uses @requires(fields: "price weight")
  // - Gateway must fetch price and weight from products subgraph first
  // - Then resolve shippingEstimate using those values (price * weight * 10)
  createTest(
    /* GraphQL */ `
      query {
        products {
          shippingEstimate
        }
      }
    `,
    {
      data: {
        products: [
          {
            shippingEstimate: 110,
          },
          {
            shippingEstimate: 440,
          },
        ],
      },
    },
  ),
  // Test @requires directive with multiple fields in response
  // Verifies that both required fields and computed fields are returned correctly
  // - Demonstrates that the gateway includes all requested fields
  // - Shows the dependency resolution working alongside other field resolution
  createTest(
    /* GraphQL */ `
      query {
        products {
          shippingEstimate
          weight
          price
        }
      }
    `,
    {
      data: {
        products: [
          {
            shippingEstimate: 110,
            weight: 1,
            price: 11,
          },
          {
            shippingEstimate: 440,
            weight: 2,
            price: 22,
          },
        ],
      },
    },
  ),
  // Test complex query combining @provides and @requires directives
  // Verifies that both directives work together in a complex nested query
  // - Products -> reviews (entity resolution)
  // - Review.author.username provided by reviews subgraph (@provides)
  // - Review.product.shippingEstimate requires price/weight (@requires)
  // This demonstrates the full power of requires/provides optimization
  createTest(
    /* GraphQL */ `
      {
        products {
          reviews {
            id
            author {
              username
            }
            product {
              name
              shippingEstimate
            }
          }
        }
      }
    `,
    {
      data: {
        products: [
          {
            reviews: [
              {
                id: "r1",
                author: {
                  username: "u-username-1",
                },
                product: {
                  name: "p-name-1",
                  shippingEstimate: 110,
                },
              },
            ],
          },
          {
            reviews: [
              {
                id: "r2",
                author: {
                  username: "u-username-1",
                },
                product: {
                  name: "p-name-2",
                  shippingEstimate: 440,
                },
              },
            ],
          },
        ],
      },
    },
  ),
  // Test circular entity references
  // Verifies that entities can reference each other without infinite loops
  // - User -> reviews -> product -> reviews (circular reference)
  // Tests the gateway's ability to handle complex entity relationships
  createTest(
    /* GraphQL */ `
      {
        me {
          reviews {
            product {
              reviews {
                id
              }
            }
          }
        }
      }
    `,
    {
      data: {
        me: {
          reviews: [
            {
              product: {
                reviews: [
                  {
                    id: "r1",
                  },
                ],
              },
            },
            {
              product: {
                reviews: [
                  {
                    id: "r2",
                  },
                ],
              },
            },
          ],
        },
      },
    },
  ),
  // Test entity resolution from user through product chain
  // Verifies that product fields can be resolved through user reviews
  // - me.reviews.product.inStock requires multiple entity resolutions
  // Tests the gateway's ability to chain entity resolutions efficiently
  createTest(
    /* GraphQL */ `
      query {
        me {
          reviews {
            product {
              inStock
            }
          }
        }
      }
    `,
    {
      data: {
        me: {
          reviews: [
            {
              product: {
                inStock: true,
              },
            },
            {
              product: {
                inStock: false,
              },
            },
          ],
        },
      },
    },
  ),
  // Test @requires directive through entity chain
  // Verifies that @requires works when accessed through multiple entity resolutions
  // - me.reviews.product.shippingEstimate requires price/weight through entity chain
  // This is the most complex test combining entity resolution with field dependencies
  createTest(
    /* GraphQL */ `
      query {
        me {
          reviews {
            product {
              shippingEstimate
            }
          }
        }
      }
    `,
    {
      data: {
        me: {
          reviews: [
            {
              product: {
                shippingEstimate: 110,
              },
            },
            {
              product: {
                shippingEstimate: 440,
              },
            },
          ],
        },
      },
    },
  ),
  // Test multiple @requires fields in complex query
  // Verifies that multiple computed fields can be resolved simultaneously
  // - shippingEstimate and shippingEstimateTag both use @requires(fields: "price weight")
  // Tests that the gateway efficiently handles multiple field dependencies
  createTest(
    /* GraphQL */ `
      query {
        me {
          reviews {
            product {
              shippingEstimate
              shippingEstimateTag
            }
          }
        }
      }
    `,
    {
      data: {
        me: {
          reviews: [
            {
              product: {
                shippingEstimate: 110,
                shippingEstimateTag: "#p1#110#",
              },
            },
            {
              product: {
                shippingEstimate: 440,
                shippingEstimateTag: "#p2#440#",
              },
            },
          ],
        },
      },
    },
  ),
];
