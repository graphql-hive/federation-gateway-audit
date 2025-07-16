import { createTest } from "../../testkit.js";

export default [
  /**
   * The "Query.review" returns `AnonymousReview`,
   * so the gateway shouldn't ask for Product's `c` and `d` fields.
   */
  createTest(
    /* GraphQL */ `
      query {
        review {
          ... on AnonymousReview {
            product {
              b
            }
          }
          ... on UserReview {
            product {
              c
              d
            }
          }
        }
      }
    `,
    {
      errors: false,
      data: {
        review: {
          product: {
            b: "A for 1",
          },
        },
      },
    },
  ),
];
