import { shouldPunishForPoorPlans } from "../../env.js";
import { createSubgraph } from "../../subgraph.js";
import { entities } from "./data.js";

// "a" owns the Entity type. It is the only subgraph that can resolve `extra`,
// but `name` and `description` are also defined here so they have an owner.
//
// In a correct query plan the gateway only calls "a" when the client asks for
// `extra` (the field that "b" cannot @provide). It must NEVER ask "a" for
// `name` or `description` since "b" already declares it can resolve them via
// `@provides`. The throwing field resolvers below catch that mistake.
export default createSubgraph("a", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.3"
        import: ["@key", "@shareable"]
      )

    type Query {
      _aPlaceholder: Boolean
    }

    type Entity @key(fields: "id") {
      id: ID!
      name: String! @shareable
      description: String! @shareable
      extra: String!
    }
  `,
  resolvers: {
    Entity: {
      __resolveReference(key: { id: string }) {
        const entity = entities.find((e) => e.id === key.id);

        if (!entity) {
          return null;
        }

        return {
          id: entity.id,
          name: entity.name,
          description: entity.description,
          extra: entity.extra,
        };
      },
      name(parent: { name: string }) {
        if (shouldPunishForPoorPlans()) {
          throw new Error(
            "You should be using the 'b' subgraph for `name` (it is provided via @provides on Query.entity / Query.entities).",
          );
        }

        return parent.name;
      },
      description(parent: { description: string }) {
        if (shouldPunishForPoorPlans()) {
          throw new Error(
            "You should be using the 'b' subgraph for `description` (it is provided via @provides on Query.entity / Query.entities).",
          );
        }

        return parent.description;
      },
    },
  },
});
