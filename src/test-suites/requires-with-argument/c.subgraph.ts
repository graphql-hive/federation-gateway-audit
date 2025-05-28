import { createSubgraph } from "../../subgraph.js";
import { comments, posts } from "./data.js";

export default createSubgraph("c", {
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
      comments(limit: Int!): [Comment] @external
    }

    type Comment @key(fields: "id") {
      id: ID!
      authorId: ID
      body: String!
      sameCommentOnOtherPosts: [Post] @external
      isCommentSpam: Boolean
        @requires(
          fields: "sameCommentOnOtherPosts { comments(limit: 50) { id } }"
        )
    }
  `,
  resolvers: {
    Query: {
      feed() {
        return posts.map((post) => ({ id: post.id }));
      },
    },
    Post: {
      __resolveReference(key: { id: string }) {
        const post = posts.find((post) => post.id === key.id);

        if (!post) {
          return null;
        }

        return {
          id: post.id,
        };
      },
      comments(post: { id: string }, { limit }: { limit: number }) {
        return comments
          .filter((comment) => comment.postId === post.id)
          .slice(0, limit)
          .map((c) => ({
            id: c.id,
            authorId: c.authorId,
            body: c.body,
          }));
      },
    },
    Comment: {
      __resolveReference(ref: {
        id: string;
        sameCommentOnOtherPosts?: { comments: { id: string }[] }[];
      }) {
        const comment = comments.find((c) => c.id === ref.id);

        if (!comment) {
          return null;
        }

        return {
          id: comment.id,
          authorId: comment.authorId,
          body: comment.body,
          isCommentSpam: ref.sameCommentOnOtherPosts?.length
            ? ref.sameCommentOnOtherPosts?.every((p) =>
                // making sure that the ref contains the full "@requires"
                p.comments.every((c) => c.id)
              )
            : false,
        };
      },
    },
  },
});
