import { createTest } from "../../testkit.js";

export default [
  // Test complex entity key relationships between multiple subgraphs
  // Verifies that entities can be resolved using different key fields across subgraphs
  // - Entity B references multiple Entity A instances
  // - Each subgraph can resolve Entity A using different key strategies
  // - Tests that field resolution works correctly across the entity relationship chain
  // This demonstrates advanced federation patterns where entities have complex interdependencies
  createTest(
    /* GraphQL */ `
      query {
        b {
          id
          a {
            id
            name
            nameInB
          }
        }
      }
    `,
    {
      data: {
        b: {
          id: "100",
          a: [
            {
              id: "1",
              name: "a.1",
              nameInB: "b.a.nameInB a.1",
            },
          ],
        },
      },
    },
  ),
];
