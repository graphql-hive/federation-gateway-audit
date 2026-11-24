import { createSubgraph } from "../../subgraph.js";

export default createSubgraph("a", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.1"
        import: ["@key", "@composeDirective"]
      )
      @link(url: "https://myspecs.dev/access/v1.0", import: ["@access"])
      @composeDirective(name: "@access")

    directive @access(scope: Scope!) on FIELD

    enum Scope {
      PUBLIC
      PRIVATE
    }

    type Query {
      a: String
    }
  `,
  resolvers: {
    Query: {
      a(_: unknown, __: unknown, ___: unknown) {
        return "a";
      },
    },
  },
});
