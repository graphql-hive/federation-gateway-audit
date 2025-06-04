import { createSubgraph } from "../../subgraph.js";
import { posts } from "./data.js";

export default createSubgraph("b", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.3"
        import: ["@key", "@external", "@requires"]
      )

    type Post @key(fields: "id") {
      id: ID!
      author: Author!
      byNovice: Boolean! @requires(fields: "author { yearsOfExperience }")
    }

    type Author @key(fields: "id") {
      id: ID!
      yearsOfExperience: Int! @external
    }
  `,
  resolvers: {
    Post: {
      __resolveReference(ref: {
        id: string;
        author?: { yearsOfExperience: number };
      }) {
        const post = posts.find((post) => post.id === ref.id);
        if (!post) {
          return null;
        }
        return {
          id: post.id,
          author: {
            id: post.author.id,
            ...ref.author,
          },
        };
      },
      byNovice(post: { author: { yearsOfExperience: number } }) {
        return post.author.yearsOfExperience < 10;
      },
    },
  },
});
