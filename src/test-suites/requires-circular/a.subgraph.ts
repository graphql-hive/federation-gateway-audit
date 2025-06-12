import { createSubgraph } from "../../subgraph.js";
import { authors, posts } from "./data.js";

export default createSubgraph("a", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.3"
        import: ["@key", "@external", "@requires"]
      )

    type Query {
      feed: [Post]
    }

    type Post @key(fields: "id") {
      id: ID!
      byNovice: Boolean! @external
      byExpert: Boolean! @requires(fields: "byNovice")
    }

    type Author @key(fields: "id") {
      id: ID!
      name: String!
      yearsOfExperience: Int!
    }
  `,
  resolvers: {
    Query: {
      feed() {
        return posts.map((post) => ({ id: post.id }));
      },
    },
    Post: {
      __resolveReference(ref: { id: string; byNovice?: boolean }) {
        const post = posts.find((post) => post.id === ref.id);
        if (!post) {
          return null;
        }
        if (ref.byNovice == null) {
          return {
            id: post.id,
          };
        }
        return {
          id: post.id,
          byNovice: ref.byNovice,
        };
      },
      byExpert(post: { byNovice: boolean }) {
        if (post.byNovice == null) {
          // ensuring requires is not skipped
          return null;
        }
        return !post.byNovice;
      },
    },
    Author: {
      __resolveReference(ref: { id: string }) {
        const author = authors.find((author) => author.id === ref.id);
        if (!author) {
          return null;
        }
        return {
          id: author.id,
          name: author.name,
          yearsOfExperience: author.yearsOfExperience,
        };
      },
    },
  },
});
