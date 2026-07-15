import { createTest } from "../../testkit.js";

export default [
  // Test __typename resolution in union types
  // Verifies that the __typename field correctly identifies concrete types in unions
  // - union query returns different concrete types (Oven)
  // - __typename field should return the correct concrete type name
  // - Tests both direct __typename and aliased typename fields
  createTest(
    /* GraphQL */ `
      query {
        union {
          __typename
          typename: __typename
        }
      }
    `,
    {
      data: {
        union: {
          __typename: "Oven",
          typename: "Oven",
        },
      },
    },
  ),
  // Test __typename resolution in interface types
  // Verifies that __typename works correctly with interface types
  // - interface query returns concrete types implementing the interface
  // - __typename should return the concrete type name (Toaster), not the interface name
  // - Tests multiple __typename field aliases in the same query
  createTest(
    /* GraphQL */ `
      query {
        interface {
          id
          __typename
          typename: __typename
          t: __typename
        }
      }
    `,
    {
      data: {
        interface: {
          id: "2",
          __typename: "Toaster",
          typename: "Toaster",
          t: "Toaster",
        },
      },
    },
  ),
  // Test __typename in union type with inline fragments
  // Verifies that __typename resolution works within inline fragments
  // - union query with inline fragments for different concrete types
  // - __typename accessed both directly and within fragments
  // - Tests fragment-based type resolution patterns
  createTest(
    /* GraphQL */ `
      query {
        union {
          __typename
          ... on Oven {
            typename: __typename
          }
          ... on Toaster {
            typename: __typename
          }
        }
      }
    `,
    {
      data: {
        union: {
          __typename: "Oven",
          typename: "Oven",
        },
      },
    },
  ),
  // Test __typename in interface type with inline fragments
  // Verifies that __typename works correctly in interface queries with fragments
  // - interface query with fragments for concrete implementing types
  // - Demonstrates proper type resolution in federated interface scenarios
  createTest(
    /* GraphQL */ `
      query {
        interface {
          __typename
          ... on Oven {
            typename: __typename
          }
          ... on Toaster {
            typename: __typename
          }
        }
      }
    `,
    {
      data: {
        interface: {
          __typename: "Toaster",
          typename: "Toaster",
        },
      },
    },
  ),
  // Test basic entity resolution without __typename
  // Verifies normal entity resolution works alongside __typename tests
  // - users query returns simple entity data
  // - Provides baseline for comparing with __typename behavior
  createTest(
    /* GraphQL */ `
      query {
        users {
          id
        }
      }
    `,
    {
      data: {
        users: [
          {
            id: "u1",
          },
          {
            id: "u2",
          },
        ],
      },
    },
  ),
  // Test __typename with regular entity types
  // Verifies that __typename works correctly with standard federated entities
  // - users query returns entities with their concrete type name
  // - In this case, all users are "Admin" type
  // - Tests __typename behavior in entity-based federation scenarios
  createTest(
    /* GraphQL */ `
      query {
        users {
          __typename
        }
      }
    `,
    {
      data: {
        users: [
          {
            __typename: "Admin",
          },
          {
            __typename: "Admin",
          },
        ],
      },
    },
  ),
];
