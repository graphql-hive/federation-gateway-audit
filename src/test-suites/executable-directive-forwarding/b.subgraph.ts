import type { GraphQLResolveInfo } from "graphql";
import { createSubgraph } from "../../subgraph.js";
import { effectiveAccessScope } from "./access-scope.js";

export default createSubgraph("b", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

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
      b(_: unknown, __: unknown, ___: unknown, info: GraphQLResolveInfo) {
        return `b:${effectiveAccessScope(info)}`;
      },
    },
  },
});
