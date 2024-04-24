import { createSubgraph } from "../../subgraph";
import { media } from "./data";

export default createSubgraph("a", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.3"
        import: ["@shareable"]
      )

    union Media = Book | Song

    type Book {
      title: String! @shareable
    }

    type Song {
      title: String! @shareable
    }

    type Query {
      media: Media @shareable
      book: Book @shareable
      song: Media @shareable
    }
  `,
  resolvers: {
    Query: {
      media: () => media,
      book: () => media,
      song: () => {
        return {
          __typename: "Song",
          title: "Song Title",
        };
      },
    },
  },
});
