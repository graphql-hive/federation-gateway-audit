import { createSubgraph } from "../../subgraph.js";
import { products } from "./data.js";

export default createSubgraph("a", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.3"
        import: ["@key", "@external", "@requires"]
      )

    type Product @key(fields: "upc") {
      upc: String!
      weight: Int @external
      price(currency: String!): Int @external
      shippingEstimate: Int
        @requires(
          fields: """
          price(currency: "USD") weight
          """
        )
      category: Category @external
      isExpensiveCategory: Boolean
        @requires(
          fields: """
          category { averagePrice(currency: "USD") }
          """
        )
    }

    type Category @external {
      averagePrice(currency: String!): Int
    }
  `,
  resolvers: {
    Product: {
      __resolveReference(
        key: { upc: string; price: number; weight: number } | { upc: string }
      ) {
        const product = products.find((p) => p.upc === key.upc);

        if (!product) {
          return null;
        }

        if ("weight" in key && "price" in key) {
          return {
            upc: product.upc,
            weight: key.weight,
            price: key.price,
            category: product.category,
          };
        }

        return {
          upc: product.upc,
          category: product.category,
        };
      },
      shippingEstimate(product: { price: number; weight: number }) {
        return product.price * product.weight * 10;
      },
      isExpensiveCategory(product: { category: { averagePrice: number } }) {
        return product.category.averagePrice > 11;
      },
    },
  },
});
