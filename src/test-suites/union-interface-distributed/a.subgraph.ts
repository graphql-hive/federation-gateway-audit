import { createSubgraph } from "../../subgraph.js";
import { products } from "./data.js";

export default createSubgraph("a", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.3"
        import: ["@shareable", "@key"]
      )

    type Query {
      products: [Product]
      node(id: ID!): Node
      nodes: [Node]
      toasters: [Toaster]
    }

    union Product = Oven | Toaster

    interface Node {
      id: ID!
    }

    interface WithWarranty {
      warranty: Int
    }

    type Oven @key(fields: "id") {
      id: ID!
    }

    type Toaster implements Node & WithWarranty @key(fields: "id") {
      id: ID!
      warranty: Int
    }
  `,
  resolvers: {
    Query: {
      products() {
        return products.map((product) => {
          if (product.__typename === "Oven") {
            return {
              __typename: "Oven",
              id: product.id,
            };
          } else {
            return {
              __typename: "Toaster",
              id: product.id,
              warranty: product.warranty,
            };
          }
        });
      },
      node(_: {}, { id }: { id: string }) {
        const product = products.find((p) => p.id === id);

        if (product?.__typename === "Oven") {
          return {
            __typename: "Oven",
            id: product.id,
          };
        } else if (product?.__typename === "Toaster") {
          return {
            __typename: "Toaster",
            id: product.id,
            warranty: product.warranty,
          };
        }

        return null;
      },
      toasters() {
        return products
          .filter((product) => product.__typename === "Toaster")
          .map((toaster) => ({
            __typename: "Toaster",
            id: toaster.id,
            warranty: toaster.warranty,
          }));
      },
      nodes() {
        return products
          .filter((product) => product.__typename === "Toaster")
          .map((toaster) => ({
            __typename: "Toaster",
            id: toaster.id,
            warranty: toaster.warranty,
          }));
      },
    },
    Oven: {
      __resolveReference(key: { id: string }) {
        const oven = products.find((p) => p.id === key.id);

        if (oven?.__typename === "Oven") {
          return {
            __typename: "Oven",
            id: oven.id,
          };
        }

        return null;
      },
      warranty() {
        throw new Error("Never");
      },
    },
    Toaster: {
      __resolveReference(key: { id: string }) {
        const toaster = products.find((p) => p.id === key.id);

        if (toaster?.__typename === "Toaster") {
          return {
            __typename: "Toaster",
            id: toaster.id,
            warranty: toaster.warranty,
          };
        }

        return null;
      },
    },
  },
});
