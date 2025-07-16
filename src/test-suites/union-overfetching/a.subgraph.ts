import { createSubgraph } from "../../subgraph.js";

export default createSubgraph("a", {
  typeDefs: /* GraphQL */ `
    type Query {
      review: Review
    }

    type Product @key(fields: "id") {
      id: ID!
    }

    union Review = AnonymousReview | UserReview

    type AnonymousReview {
      product: Product
    }

    type UserReview {
      product: Product
    }
  `,
  resolvers: {
    Query: {
      review() {
        return {
          __typename: "AnonymousReview",
          product: {
            id: "1",
          },
        };
      },
    },
  },
});
