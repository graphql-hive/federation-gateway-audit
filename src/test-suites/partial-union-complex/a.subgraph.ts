import { createSubgraph } from "../../subgraph.js";
import { aActions, container, sharedActions } from "./data.js";

export default createSubgraph("a", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.3"
        import: ["@key", "@shareable"]
      )

    type Query {
      rootA: Container
      shared: Container @shareable
    }

    type Container @key(fields: "id") {
      id: ID!
      wrapper: Wrapper @shareable
    }

    type Wrapper @shareable {
      actions: [Action!]! @shareable
    }

    union Action = Common | OnlyA

    type Common @shareable {
      label: String
    }

    type OnlyA {
      a: String
    }
  `,
  resolvers: {
    Query: {
      rootA: () => ({ ...container, actions: aActions }),
      shared: () => ({ ...container, actions: sharedActions }),
    },
    Container: {
      __resolveReference(key: { id: string }) {
        if (key.id !== container.id) {
          return null;
        }

        return { ...container, actions: aActions };
      },
      wrapper(parent: { actions?: typeof aActions }) {
        return { actions: parent.actions ?? aActions };
      },
    },
    Action: {
      __resolveType(value: { __typename: string }) {
        return value.__typename;
      },
    },
  },
});
