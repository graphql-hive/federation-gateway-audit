import type { GraphQLResolveInfo } from "graphql";
import { createSubgraph } from "../../subgraph.js";
import { effectiveAccessScope } from "./access-scope.js";

export default createSubgraph("a", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

    directive @access(scope: Scope! = PUBLIC) on FIELD

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
      a(_: unknown, __: unknown, ___: unknown, info: GraphQLResolveInfo) {
        return `a:${effectiveAccessScope(info)}`;
      },
    },
  },
});
