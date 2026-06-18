import { createSubgraph } from "../../subgraph.js";
import { bActions, container, sharedActions } from "./data.js";

export default createSubgraph("b", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.3"
        import: ["@key", "@shareable"]
      )

    type Query {
      rootB: Container
      shared: Container @shareable
    }

    type Container @key(fields: "id") {
      id: ID!
      wrapper: Wrapper @shareable
      bWrapper: Wrapper
    }

    type Wrapper @shareable {
      actions: [Action!]! @shareable
    }

    union Action = Common | OnlyB

    type Common @shareable {
      label: String
    }

    type OnlyB {
      b: String
    }
  `,
  resolvers: {
    Query: {
      rootB: () => ({ ...container, actions: bActions }),
      shared: () => ({ ...container, actions: sharedActions }),
    },
    Container: {
      __resolveReference(key: { id: string }) {
        if (key.id !== container.id) {
          return null;
        }

        return { ...container, actions: bActions };
      },
      wrapper(parent: { actions?: typeof bActions }) {
        return { actions: parent.actions ?? bActions };
      },
      bWrapper() {
        return { actions: bActions };
      },
    },
    Action: {
      __resolveType(value: { __typename: string }) {
        return value.__typename;
      },
    },
  },
});
