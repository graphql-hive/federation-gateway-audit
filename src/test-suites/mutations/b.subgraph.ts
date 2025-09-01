import { createSubgraph } from "../../subgraph.js";
import {
  addCategory,
  deleteNumber,
  deleteProduct,
  getCategories,
  getProducts,
} from "./data.js";

export default createSubgraph("b", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.3"
        import: ["@key", "@external", "@requires", "@shareable"]
      )

    type Product @key(fields: "id") {
      id: ID!
      price: Float! @external
      isExpensive: Boolean! @requires(fields: "price")
      isAvailable: Boolean!
    }

    type Mutation {
      delete(requestId: String!): Int!
      addCategory(name: String!, requestId: String!): Category! @shareable
    }

    type Category @key(fields: "id") {
      id: ID!
      name: String!
    }
  `,
  resolvers: {
    Mutation: {
      delete(
        _: {},
        args: {
          requestId: string;
        },
      ) {
        return deleteNumber(args.requestId);
      },
      async addCategory(
        _: {},
        {
          name,
          requestId,
        }: {
          name: string;
          requestId: string;
        },
      ) {
        return addCategory(name, requestId);
      },
    },
    Product: {
      async __resolveReference(key: { id: string; price?: number }) {
        const product = (await getProducts()).find(
          (product) => product.id === key.id,
        );

        if (!product) {
          return null;
        }

        await deleteProduct(product.id);

        if (typeof product.price === "number") {
          return {
            id: product.id,
            isAvailable: true,
            price: product.price,
          };
        }

        return {
          id: product.id,
          isAvailable: false,
        };
      },
      isExpensive(product: { price?: number }) {
        if (typeof product.price !== "number") {
          throw new Error("Price is not available");
        }

        return product.price > 100;
      },
    },
    Category: {
      __resolveReference(key: { id: string }) {
        const categories = getCategories();
        const category = categories.find((p) => p.id === key.id);

        if (!category) {
          return null;
        }

        return {
          id: category.id,
          name: category.name,
        };
      },
    },
  },
});
