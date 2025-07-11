import { createSubgraph } from "../../subgraph.js";

export default createSubgraph("c", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.3"
        import: ["@key", "@interfaceObject"]
      )

    type Query {
      playlist: Playlist
    }

    type Playlist @key(fields: "id") {
      id: ID!
      name: String
      media: Media
    }

    type Media @key(fields: "id") @interfaceObject {
      id: ID!
    }
  `,
  resolvers: {
    Query: {
      playlist() {
        return { id: "1", name: "name for 1", media: { id: "1" } };
      },
    },
    Playlist: {
      __resolveReference(ref: { id: string }) {
        return {
          id: ref.id,
          name: `name for ${ref.id}`,
          media: { id: ref.id },
        };
      },
    },
    Media: {
      __resolveReference(ref: { id: string }) {
        return {
          id: ref.id,
        };
      },
    },
  },
});
