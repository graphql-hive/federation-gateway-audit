import { createSubgraph } from "../../subgraph.js";

export default createSubgraph("c", {
  typeDefs: /* GraphQL */ `
    type Product @key(fields: "id") {
      id: ID!
      c: String!
    }
  `,
  resolvers: {
    Product: {
      __resolveReference() {
        throw new Error("Product.c is not needed");
      },
    },
  },
});
