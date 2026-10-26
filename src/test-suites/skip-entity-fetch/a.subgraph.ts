import { createSubgraph } from "../../subgraph.js";
import { product } from "./data.js";

export default createSubgraph("a", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

    type Query {
      product: Product
    }

    type Product @key(fields: "id") {
      id: ID!
      name: String
    }
  `,
  resolvers: {
    Query: {
      product: () => ({ id: product.id, name: product.name }),
    },
  },
});
