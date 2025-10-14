import { createTest } from "../../testkit.js";

export default [
  // Test @include directive with false condition
  // Verifies that fields with @include(if: false) are not included in the response
  // - neverCalledInclude field should not appear because $bool defaults to false
  // - Tests that the gateway correctly processes @include directives
  // - Ensures conditional field inclusion works in federated queries
  createTest(
    /* GraphQL */ `
      query ($bool: Boolean = false) {
        product {
          price
          neverCalledInclude @include(if: $bool)
        }
      }
    `,
    {
      data: {
        product: {
          price: 699.99,
        },
      },
    },
  ),
  // Test @skip directive with true condition
  // Verifies that fields with @skip(if: true) are not included in the response
  // - neverCalledSkip field should not appear because $bool defaults to true
  // - Tests that the gateway correctly processes @skip directives
  // - Ensures conditional field exclusion works in federated queries
  createTest(
    /* GraphQL */ `
      query ($bool: Boolean = true) {
        product {
          price
          neverCalledSkip @skip(if: $bool)
        }
      }
    `,
    {
      data: {
        product: {
          price: 699.99,
        },
      },
    },
  ),
  // Test @include directive with true condition
  // Verifies that fields with @include(if: true) are included in the response
  // - include field should appear and return its value because $bool is true
  // - Tests that @include directive correctly includes fields when condition is met
  // - Validates that federated resolvers are called for included fields
  createTest(
    /* GraphQL */ `
      query ($bool: Boolean = true) {
        product {
          price
          include @include(if: $bool)
        }
      }
    `,
    {
      data: {
        product: {
          price: 699.99,
          include: true,
        },
      },
    },
  ),
  // Test @skip directive with false condition
  // Verifies that fields with @skip(if: false) are included in the response
  // - skip field should appear and return its value because $bool is false
  // - Tests that @skip directive correctly includes fields when condition is not met
  // - Validates that federated resolvers are called for non-skipped fields
  createTest(
    /* GraphQL */ `
      query ($bool: Boolean = false) {
        product {
          price
          skip @skip(if: $bool)
        }
      }
    `,
    {
      data: {
        product: {
          price: 699.99,
          skip: true,
        },
      },
    },
  ),
];
