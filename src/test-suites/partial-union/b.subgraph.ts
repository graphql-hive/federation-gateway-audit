import { createSubgraph } from "../../subgraph.js";

// "secondary" subgraph: contributes only a partial union (`Alpha` only) and the
// shared `@shareable Response` type. It does NOT define `getResponse`, so the
// planner must resolve the whole field from the primary subgraph. Its only role
// is to make `Action` a partial union across the supergraph: a buggy planner
// sees that `Response`/`Alpha` are shareable here and wrongly assumes `Beta`
// and `Gamma` can be fetched via entity resolution, stripping their fragments.
export default createSubgraph("b", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.0"
        import: ["@key", "@shareable"]
      )

    type Response @shareable {
      actions: [Action!]!
      message: String
    }

    union Action = Alpha

    type Alpha @shareable {
      id: ID!
      value: String
    }
  `,
  resolvers: {},
});
