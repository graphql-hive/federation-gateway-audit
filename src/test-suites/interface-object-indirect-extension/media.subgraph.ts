import { createSubgraph } from "../../subgraph.js";

export default createSubgraph("a", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

    type Query {
      media: Media
    }

    interface Media @key(fields: "id") {
      id: ID!
      title: String
    }

    type Video implements Media @key(fields: "id") {
      id: ID!
      title: String
      duration: Int
    }

    type Article implements Media @key(fields: "id") {
      id: ID!
      title: String
      wordCount: Int
    }
  `,
  resolvers: {
    Query: {
      media() {
        return {
          id: "1",
          title: "title for 1",
          duration: 100,
        };
      },
    },
    Media: {
      __resolveType() {
        return "Video";
      },
    },
    Video: {
      __resolveReference(ref: { id: string }) {
        return {
          id: ref.id,
          title: `title for ${ref.id}`,
          duration: 100 * Number(ref.id),
        };
      },
    },
    Article: {
      __resolveReference(ref: { id: string }) {
        return {
          id: ref.id,
          title: `title for ${ref.id}`,
          wordCount: 900 * Number(ref.id),
        };
      },
    },
  },
});
