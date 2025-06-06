import { createSubgraph } from "../../subgraph.js";
import { products } from "./data.js";

export default createSubgraph("b", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

    type Query {
      products: [Product]
    }

    type Product @key(fields: "upc") {
      upc: String!
      name: String
      price(currency: String!): Int
      weight: Int
      category: Category
    }

    type Category {
      averagePrice(currency: String!): Int
    }
  `,
  resolvers: {
    Query: {
      products() {
        return products.map((p) => ({
          upc: p.upc,
          name: p.name,
          price: p.price,
          weight: p.weight,
          category: p.category,
        }));
      },
    },
    Product: {
      __resolveReference(key: { upc: string }) {
        const product = products.find((p) => p.upc === key.upc);

        if (!product) {
          return null;
        }

        return {
          upc: product.upc,
          name: product.name,
          price: product.price,
          weight: product.weight,
          category: product.category,
        };
      },
    },
  },
});
