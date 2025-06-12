import { createSubgraph } from "../../subgraph.js";
import { media } from "./data.js";

const song = {
  __typename: "Song",
  id: "s2",
  title: "Song Title",
  aTitle: "A: Song Title",
};

export default createSubgraph("a", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.3"
        import: ["@shareable", "@key"]
      )

    union Media = Book | Song
    union ViewerMedia = Book | Song

    type Book @key(fields: "id") {
      id: ID!
      title: String! @shareable
      aTitle: String!
    }

    type Song @key(fields: "id") {
      id: ID!
      title: String! @shareable
      aTitle: String!
    }

    type Query {
      media: Media @shareable
      aMedia: Media @shareable
      book: Book @shareable
      song: Media @shareable
      viewer: Viewer @shareable
    }

    type Viewer {
      media: ViewerMedia @shareable
      aMedia: ViewerMedia
      book: Book @shareable
      song: ViewerMedia @shareable
    }
  `,
  resolvers: {
    Query: {
      media: () => media,
      aMedia: () => media,
      book: () => media,
      song: () => song,
      viewer: () => {
        return {
          media: media,
          aMedia: media,
          book: media,
          song: song,
        };
      },
    },
    Book: {
      __resolveReference(key: { id: string }) {
        if (key.id !== media.id) {
          return null;
        }

        return media;
      },
    },
    Song: {
      __resolveReference(key: { id: string }) {
        if (key.id !== song.id) {
          return null;
        }

        return song;
      },
    },
  },
});
