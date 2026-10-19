import { createTest } from "../../testkit.js";
import { productA, productB, productC } from "./data.js";

export default [
  // The issue's query: fragments on every union member, but the response
  // contains no `ComponentC`. `Product.c` must not be requested, and
  // `Product.a` / `Product.b` must only be requested for their own products.
  createTest(
    /* GraphQL */ `
      query {
        card {
          components {
            __typename
            ... on ComponentA {
              product {
                id
                a
              }
            }
            ... on ComponentB {
              product {
                id
                b
              }
            }
            ... on ComponentC {
              product {
                id
                c
              }
            }
          }
        }
      }
    `,
    {
      data: {
        card: {
          components: [
            {
              __typename: "ComponentA",
              product: { id: productA.id, a: productA.a },
            },
            {
              __typename: "ComponentB",
              product: { id: productB.id, b: productB.b },
            },
          ],
        },
      },
      errors: false,
    },
  ),
  // Same query, but without `__typename` and `id` in the selections.
  createTest(
    /* GraphQL */ `
      query {
        card {
          components {
            ... on ComponentA {
              product {
                a
              }
            }
            ... on ComponentB {
              product {
                b
              }
            }
            ... on ComponentC {
              product {
                c
              }
            }
          }
        }
      }
    `,
    {
      data: {
        card: {
          components: [
            { product: { a: productA.a } },
            { product: { b: productB.b } },
          ],
        },
      },
      errors: false,
    },
  ),
  // Only `ComponentC` is present, while `ComponentA` and `ComponentB` are
  // selected. Only `Product.c` may be requested.
  createTest(
    /* GraphQL */ `
      query {
        cardC {
          components {
            __typename
            ... on ComponentA {
              product {
                a
              }
            }
            ... on ComponentB {
              product {
                b
              }
            }
            ... on ComponentC {
              product {
                c
              }
            }
          }
        }
      }
    `,
    {
      data: {
        cardC: {
          components: [
            { __typename: "ComponentC", product: { c: productC.c } },
          ],
        },
      },
      errors: false,
    },
  ),
  // Control: a single fragment per query never overfetches, so the schema
  // and data are known to be valid.
  createTest(
    /* GraphQL */ `
      query {
        card {
          components {
            ... on ComponentA {
              product {
                id
                a
              }
            }
          }
        }
      }
    `,
    {
      data: {
        card: {
          components: [{ product: { id: productA.id, a: productA.a } }, {}],
        },
      },
      errors: false,
    },
  ),
];
