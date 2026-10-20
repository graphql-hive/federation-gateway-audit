import { createTest } from "../../testkit.js";
import { product } from "./data.js";

export default [
  // `details` is the only field that needs subgraph "b". When it is skipped,
  // the entity fetch to "b" has nothing to resolve and must not be made.
  createTest(
    /* GraphQL */ `
      query ($skipDetails: Boolean!) {
        product {
          id
          name
          details @skip(if: $skipDetails) {
            color
            size
          }
        }
      }
    `,
    {
      data: {
        product: { id: product.id, name: product.name },
      },
      errors: false,
    },
    { skipDetails: true },
  ),
  // Same, with `@include`.
  createTest(
    /* GraphQL */ `
      query ($withDetails: Boolean!) {
        product {
          id
          name
          details @include(if: $withDetails) {
            color
            size
          }
        }
      }
    `,
    {
      data: {
        product: { id: product.id, name: product.name },
      },
      errors: false,
    },
    { withDetails: false },
  ),
  // Two object fields from "b", one turned off by `@skip`, the other by
  // `@include`, each with its own variable.
  createTest(
    /* GraphQL */ `
      query ($skipDetails: Boolean!, $withInventory: Boolean!) {
        product {
          id
          details @skip(if: $skipDetails) {
            color
          }
          inventory @include(if: $withInventory) {
            inStock
          }
        }
      }
    `,
    {
      data: {
        product: { id: product.id },
      },
      errors: false,
    },
    { skipDetails: true, withInventory: false },
  ),
  // Two object fields from "b", each skipped by its own variable.
  createTest(
    /* GraphQL */ `
      query ($skipDetails: Boolean!, $skipInventory: Boolean!) {
        product {
          id
          details @skip(if: $skipDetails) {
            color
          }
          inventory @skip(if: $skipInventory) {
            inStock
          }
        }
      }
    `,
    {
      data: {
        product: { id: product.id },
      },
      errors: false,
    },
    { skipDetails: true, skipInventory: true },
  ),
  // Only one of the two object fields is skipped, so the fetch is needed.
  createTest(
    /* GraphQL */ `
      query ($skipDetails: Boolean!, $withInventory: Boolean!) {
        product {
          id
          details @skip(if: $skipDetails) {
            color
          }
          inventory @include(if: $withInventory) {
            inStock
            warehouse
          }
        }
      }
    `,
    {
      data: {
        product: {
          id: product.id,
          inventory: product.inventory,
        },
      },
      errors: false,
    },
    { skipDetails: true, withInventory: true },
  ),
  // Control: nothing is skipped, so "b" must be called.
  createTest(
    /* GraphQL */ `
      query ($skipDetails: Boolean!) {
        product {
          id
          name
          details @skip(if: $skipDetails) {
            color
            size
          }
        }
      }
    `,
    {
      data: {
        product: {
          id: product.id,
          name: product.name,
          details: product.details,
        },
      },
      errors: false,
    },
    { skipDetails: false },
  ),
  // Literal condition, no variables.
  createTest(
    /* GraphQL */ `
      query {
        product {
          id
          name
          details @skip(if: true) {
            color
            size
          }
        }
      }
    `,
    {
      data: {
        product: { id: product.id, name: product.name },
      },
      errors: false,
    },
  ),
];
