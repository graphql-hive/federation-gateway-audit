import { createSubgraph } from "../../subgraph.js";
import { books } from "./data.js";

export default createSubgraph("b", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

    type Book @key(fields: "id") @key(fields: "upc") {
      id: ID!
      upc: ID!
    }
  `,
  resolvers: {
    Book: {
      __resolveReference(reference: { id: String } | { upc: String }) {
        if (reference != null) {
          let book: { id: string; upc: string } | undefined;
          if ("id" in reference) {
            book = books.find((book) => book.id === reference.id);
          }
          if ("upc" in reference) {
            book = books.find((book) => book.upc === reference.upc);
          }
          if (book != null) {
            // `a` has `Book` entities with upc: `b1, b2, b3`, but `b` has `Book` entities with only `b1` and `b2`.
            // `b3` is not available and this subgraph is the only possible step to get to the other subgraph (need of `id` field) to resolve the author.
            if (book.id === "3") {
              return null;
            }
            return {
              __typename: "Book",
              id: book.id,
              upc: book.upc,
            };
          }
        }
        throw new Error("Invalid reference");
      },
    },
  },
});
