import { createSubgraph } from "../../subgraph.js";
import { actions, message } from "./data.js";

// "primary" subgraph: declares the full union `Alpha | Beta | Gamma` and is the
// only subgraph that defines `getResponse`. `Beta` and `Gamma` have no `@key`,
// so they can only ever be resolved here.
export default createSubgraph("a", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.0"
        import: ["@key", "@shareable"]
      )

    type Query {
      getResponse: Response
    }

    type Response @shareable {
      actions: [Action!]!
      message: String
    }

    union Action = Alpha | Beta | Gamma

    type Alpha @shareable {
      id: ID!
      value: String
    }

    type Beta {
      id: ID!
      name: String
      details: String
    }

    type Gamma {
      id: ID!
      label: String
    }
  `,
  resolvers: {
    Query: {
      getResponse: () => ({ message, actions }),
    },
  },
});
