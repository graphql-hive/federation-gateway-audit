import { createSubgraph } from "../../subgraph.js";

export default createSubgraph("b", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

    type Query {
      author: Author
    }

    type Author @key(fields: "id") {
      id: ID!
      name: String
    }

    extend type Video @key(fields: "id") {
      id: ID!
      authorName: String
    }
  `,
  resolvers: {
    Query: {
      author() {
        return { id: "1", name: `name for 1` };
      },
    },
    Author: {
      __resolveReference(ref: { id: string }) {
        return { id: ref.id, name: `name for ${ref.id}` };
      },
    },
    Video: {
      authorName() {
        return "John Doe";
      },
    },
  },
});
