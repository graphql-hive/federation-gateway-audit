import { createSubgraph } from "../../subgraph.js";

export default createSubgraph("b", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.1"
        import: ["@key", "@composeDirective"]
      )
      @link(url: "https://myspecs.dev/access/v1.0", import: ["@access"])
      @composeDirective(name: "@access")

    directive @access(scope: Scope! = PUBLIC) on FIELD

    enum Scope {
      PUBLIC
      PRIVATE
    }

    type Query {
      b: String
    }
  `,
  resolvers: {
    Query: {
      b(_: unknown, __: unknown, ___: unknown) {
        return "b";
      },
    },
  },
});
