import { createSubgraph } from "../../subgraph.js";
import { card, cardC } from "./data.js";

export default createSubgraph("card", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

    type Query {
      card: ProductCard
      cardC: ProductCard
    }

    type ProductCard @key(fields: "id") {
      id: ID!
      components: [Component]
    }

    type Product @key(fields: "id") {
      id: ID!
    }

    union Component = ComponentA | ComponentB | ComponentC

    type ComponentA {
      a: String
      product: Product
    }

    type ComponentB {
      b: String
      product: Product
    }

    type ComponentC {
      c: String
      product: Product
    }
  `,
  resolvers: {
    Query: {
      card: () => card,
      cardC: () => cardC,
    },
  },
});
