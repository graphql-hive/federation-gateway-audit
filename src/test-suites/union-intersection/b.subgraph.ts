import { createSubgraph } from "../../subgraph.js";
import { media } from "./data.js";

const movie = {
  __typename: "Movie",
  id: "m3",
  title: "A Movie Title",
  bTitle: "B Movie Title",
};

export default createSubgraph("b", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.3"
        import: ["@shareable", "@key"]
      )

    type Query {
      media: Media @shareable
      bMedia: Media @shareable
      book: Media @shareable
      viewer: Viewer @shareable
    }

    union Media = Book | Movie
    union ViewerMedia = Book | Movie

    type Movie @key(fields: "id") {
      id: ID!
      title: String! @shareable
      bTitle: String!
    }

    type Book @key(fields: "id") {
      id: ID!
      title: String! @shareable
      bTitle: String!
    }

    type Viewer {
      media: ViewerMedia @shareable
      bMedia: ViewerMedia
      book: ViewerMedia @shareable
    }
  `,
  resolvers: {
    Query: {
      media: () => media,
      bMedia: () => media,
      book: () => media,
      viewer: () => {
        return {
          media,
          bMedia: movie,
          book: media,
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
    Movie: {
      __resolveReference(key: { id: string }) {
        if (key.id !== movie.id) {
          return null;
        }

        return movie;
      },
    },
  },
});
