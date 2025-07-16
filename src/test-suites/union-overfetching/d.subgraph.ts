import { createSubgraph } from "../../subgraph.js";

export default createSubgraph("d", {
  typeDefs: /* GraphQL */ `
    type Product @key(fields: "id") {
      id: ID!
      d: String!
    }
  `,
  resolvers: {
    Product: {
      __resolveReference() {
        throw new Error("Product.b is not needed");
      },
    },
  },
});
