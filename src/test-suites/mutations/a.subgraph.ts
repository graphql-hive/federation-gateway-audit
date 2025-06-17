import { createSubgraph } from "../../subgraph.js";
import {
  addCategory,
  addProduct,
  deleteProduct,
  getCategories,
  getProducts,
  initProducts,
  multiplyNumber,
} from "./data.js";

export default createSubgraph("a", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.3"
        import: ["@key", "@shareable"]
      )

    type Mutation {
      addProduct(input: AddProductInput!): Product!
      addCategory(name: String!, requestId: String!): Category! @shareable
      multiply(by: Int!, requestId: String!): Int!
    }

    type Query {
      product(id: ID!): Product!
      products: [Product!]!
    }

    input AddProductInput {
      name: String!
      price: Float!
    }

    type Product @key(fields: "id") {
      id: ID!
      name: String!
      price: Float!
    }

    type Category @key(fields: "id") {
      id: ID!
    }
  `,
  resolvers: {
    Query: {
      async product(_: {}, { id }: { id: string }) {
        initProducts();
        const product = (await getProducts()).find((p) => p.id === id);

        if (!product) {
          return null;
        }

        return {
          id: product.id,
          name: product.name,
          price: product.price,
        };
      },
      async products() {
        initProducts();
        return getProducts();
      },
    },
    Mutation: {
      async multiply(
        _: {},
        args: {
          by: number;
          requestId: string;
        },
      ) {
        return multiplyNumber(args.by, args.requestId);
      },
      async addProduct(
        _: {},
        {
          input,
        }: {
          input: {
            name: string;
            price: number;
          };
        },
      ) {
        return addProduct(input.name, input.price);
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
      async __resolveReference(key: { id: string }) {
        const products = await getProducts();
        const product = products.find((p) => p.id === key.id);

        if (!product) {
          return null;
        }

        await deleteProduct(product.id);

        return {
          id: product.id,
          name: product.name,
          price: product.price,
        };
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
        };
      },
    },
  },
});
