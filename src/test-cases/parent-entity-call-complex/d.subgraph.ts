import { createSubgraph } from "../../subgraph";

export default createSubgraph('d', {
    typeDefs: /* GraphQL */ `
     extend schema
        @link(
            url: "https://specs.apollo.dev/federation/v2.3"
            import: ["@key"]
        )

      type Query {
        productFromD(id: ID!): Product
      }

      type Product @key(fields: "id") {
        id: ID
        name: String
      }
    `,
    resolvers: {
        Query: {
            productFromD(_: never, { id }: { id: string }) {
                return {
                    id,
                    name: `Product#${id}`,
                }
            }
        }
    }
});
