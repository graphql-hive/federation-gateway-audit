import { createSubgraph } from "../../subgraph.js";
import { products } from "./data.js";

type Product = (typeof products)[number];

// Resolving a field for a product of a different kind means the gateway asked
// for a field that was only selected under a union member that isn't present
// in the response (overfetching).
function resolveFor(kind: string) {
  return (product: Product) => {
    if (product.kind !== kind) {
      throw new Error(
        `Product.${kind} requested for product "${product.id}" of kind "${product.kind}" (overfetching)`,
      );
    }

    return product[kind as keyof Product];
  };
}

export default createSubgraph("product", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

    type Product @key(fields: "id") {
      id: ID!
      a: String!
      b: String!
      c: String!
    }
  `,
  resolvers: {
    Product: {
      __resolveReference(key: { id: string }) {
        return products.find((product) => product.id === key.id);
      },
      a: resolveFor("a"),
      b: resolveFor("b"),
      c: resolveFor("c"),
    },
  },
});
