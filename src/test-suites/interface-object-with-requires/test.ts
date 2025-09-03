import { createTest } from "../../testkit.js";

export default [
  // Test @interfaceObject with @requires directive
  // Verifies that an interface object can require fields from other subgraphs
  // - anotherUsers query returns NodeWithName interface objects
  // - username field requires the "name" field from subgraph A
  // - Tests that @interfaceObject directive works with field dependencies
  createTest(
    /* GraphQL */ `
      query {
        anotherUsers {
          id
          name
          username
        }
      }
    `,
    {
      data: {
        anotherUsers: [
          {
            id: "u1",
            name: "u1-name",
            username: "u1-username",
          },
          {
            id: "u2",
            name: "u2-name",
            username: "u2-username",
          },
        ],
      },
    },
  ),
  // Test standard User entity resolution from subgraph A
  // Verifies that the concrete User type can be resolved normally
  // - users query returns User entities with all fields
  // - username field is resolved via entity resolution to subgraph B
  createTest(
    /* GraphQL */ `
      query {
        users {
          id
          name
          username
        }
      }
    `,
    {
      data: {
        users: [
          {
            id: "u1",
            name: "u1-name",
            username: "u1-username",
          },
          {
            id: "u2",
            name: "u2-name",
            username: "u2-username",
          },
        ],
      },
    },
  ),
  // Test interface object inline fragment resolution
  // Verifies that inline fragments work with @interfaceObject
  // - anotherUsers query returns NodeWithName interface objects
  // - ... on User inline fragment accesses concrete type fields
  // - age field is only available on the concrete User type from subgraph A
  createTest(
    /* GraphQL */ `
      query {
        anotherUsers {
          ... on User {
            age
          }
        }
      }
    `,
    {
      data: {
        anotherUsers: [
          {
            age: 11,
          },
          {
            age: 22,
          },
        ],
      },
    },
  ),
  // Test inline fragments with standard entity resolution
  // Verifies that inline fragments work with regular entity types
  // - users query with inline fragment on User type
  // - Tests the same pattern as above but from subgraph A perspective
  createTest(
    /* GraphQL */ `
      query {
        users {
          ... on User {
            age
          }
        }
      }
    `,
    {
      data: {
        users: [
          {
            age: 11,
          },
          {
            age: 22,
          },
        ],
      },
    },
  ),
  // Test complex field selection with interface objects and inline fragments
  // Verifies that both interface fields and concrete type fields can be selected
  // - anotherUsers returns interface objects
  // - Selects both interface fields (id, name) and concrete fields via inline fragment
  // - Demonstrates full field resolution across subgraphs with @interfaceObject
  createTest(
    /* GraphQL */ `
      query {
        anotherUsers {
          ... on User {
            age
            id
            name
            username
          }
          id
          name
        }
      }
    `,
    {
      data: {
        anotherUsers: [
          {
            age: 11,
            id: "u1",
            name: "u1-name",
            username: "u1-username",
          },
          {
            age: 22,
            id: "u2",
            name: "u2-name",
            username: "u2-username",
          },
        ],
      },
    },
  ),
  // Test complex field selection with standard entities and inline fragments
  // Verifies the same complex selection pattern with regular entity resolution
  // - users query with both direct fields and inline fragment fields
  // - Demonstrates standard entity resolution behavior for comparison
  createTest(
    /* GraphQL */ `
      query {
        users {
          ... on User {
            age
            id
            name
            username
          }
          id
          name
        }
      }
    `,
    {
      data: {
        users: [
          {
            age: 11,
            id: "u1",
            name: "u1-name",
            username: "u1-username",
          },
          {
            age: 22,
            id: "u2",
            name: "u2-name",
            username: "u2-username",
          },
        ],
      },
    },
  ),
  // Test duplicate complex field selection (edge case)
  // Verifies that duplicate field selections don't cause issues
  // - Same query as above but duplicated to test edge case handling
  // - Ensures the gateway handles redundant field selections correctly
  createTest(
    /* GraphQL */ `
      query {
        users {
          ... on User {
            age
            id
            name
            username
          }
          id
          name
        }
      }
    `,
    {
      data: {
        users: [
          {
            age: 11,
            id: "u1",
            name: "u1-name",
            username: "u1-username",
          },
          {
            age: 22,
            id: "u2",
            name: "u2-name",
            username: "u2-username",
          },
        ],
      },
    },
  ),
];
