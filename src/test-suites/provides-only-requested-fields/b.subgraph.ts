import { shouldPunishForPoorPlans } from "../../env.js";
import { createSubgraph } from "../../subgraph.js";
import { entities } from "./data.js";

// "b" is the @provides side. It exposes `Query.entity` / `Query.entities`
// with `@provides(fields: "name description")`, but BOTH `name` and
// `description` are `@external` here because "a" owns them.
//
// `@provides` is purely a HINT that this subgraph can short-circuit the
// resolution of those external fields when (and only when) the client
// actually asks for them. It does NOT mean the gateway should always pull
// every listed field from this subgraph regardless of the client selection.
//
// The custom `description` field resolver below throws in punish mode so we
// can prove (black-box) that the gateway is NOT over-forwarding fields the
// client never requested. None of the client queries in `test.ts` ask for
// `description`, so a well-behaved gateway will never trigger this resolver.
// A buggy gateway that injects every `@provides` field unconditionally will
// trigger it, the field bubbles up to a non-null parent, and the test fails
// with `entity: null`.
export default createSubgraph("b", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(
        url: "https://specs.apollo.dev/federation/v2.3"
        import: ["@key", "@external", "@provides"]
      )

    type Query {
      entity: Entity @provides(fields: "name description")
      entities: [Entity!]! @provides(fields: "name description")
    }

    type Entity @key(fields: "id") {
      id: ID!
      name: String! @external
      description: String! @external
    }
  `,
  resolvers: {
    Query: {
      entity() {
        const entity = entities[0];
        return {
          id: entity.id,
          name: entity.name,
          description: entity.description,
        };
      },
      entities() {
        return entities.map((entity) => ({
          id: entity.id,
          name: entity.name,
          description: entity.description,
        }));
      },
    },
    Entity: {
      __resolveReference(key: { id: string }) {
        if (shouldPunishForPoorPlans()) {
          throw new Error(
            "You should not be entering 'b' through `__resolveReference` for this suite. The provided fields must be served by the @provides path on Query.entity / Query.entities.",
          );
        }

        const entity = entities.find((e) => e.id === key.id);

        if (!entity) {
          return null;
        }

        return {
          id: entity.id,
          name: entity.name,
          description: entity.description,
        };
      },
      description(parent: { description: string }) {
        if (shouldPunishForPoorPlans()) {
          throw new Error(
            "Over-fetch detected: the gateway asked 'b' for `description` even though no test query selects it. `@provides` is a hint, not a forced injection.",
          );
        }

        return parent.description;
      },
    },
  },
});
