import { createSubgraph } from "../../subgraph.js";

export default createSubgraph("b", {
  typeDefs: /* GraphQL */ `
    type Product @key(fields: "id") {
      id: ID!
      b: String!
    }
  `,
  resolvers: {
    Product: {
      __resolveReference(ref: { id: string }) {
        return {
          id: ref.id,
          b: `A for ${ref.id}`,
        };
      },
    },
  },
});
