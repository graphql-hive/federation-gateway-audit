import { createTest } from "../../testkit.js";

export default [
  // Test basic query functionality with @inaccessible fields present
  // Verifies that users can be queried and their friends resolved normally
  // when the schema contains @inaccessible fields and enum values
  // - The query works because it doesn't access any @inaccessible elements
  createTest(
    /* GraphQL */ `
      query {
        usersInAge {
          id
          friends {
            id
          }
        }
      }
    `,
    {
      data: {
        usersInAge: [
          {
            id: "u1",
            friends: [
              {
                id: "u2",
              },
            ],
          },
          {
            id: "u2",
            friends: [
              {
                id: "u1",
              },
            ],
          },
        ],
      },
    },
  ),
  // Test query from friends subgraph that contains @inaccessible fields
  // Verifies that queries work normally even when executed from subgraphs
  // that have @inaccessible field arguments and enum values
  // - usersInFriends query should work despite the subgraph having @inaccessible elements
  createTest(
    /* GraphQL */ `
      query {
        usersInFriends {
          id
          friends {
            id
          }
        }
      }
    `,
    {
      data: {
        usersInFriends: [
          {
            id: "u1",
            friends: [
              {
                id: "u2",
              },
            ],
          },
          {
            id: "u2",
            friends: [
              {
                id: "u1",
              },
            ],
          },
        ],
      },
    },
  ),
  // Test that @inaccessible field arguments cannot be used
  // Verifies that attempting to use @inaccessible argument values results in an error
  // - friends(type: FRIEND) should fail because FAMILY enum value is @inaccessible
  // - This tests that the gateway properly enforces @inaccessible restrictions
  createTest(
    /* GraphQL */ `
      query {
        usersInFriends {
          id
          friends(type: FRIEND) {
            id
          }
        }
      }
    `,
    {
      errors: true,
    },
  ),
  // Test that @inaccessible fields return null when accessed
  // Verifies that fields marked @inaccessible are present in the schema but return null
  // - type field should return null because it uses the @inaccessible FAMILY enum value
  // - This demonstrates how @inaccessible affects field resolution
  createTest(
    /* GraphQL */ `
      query {
        usersInFriends {
          id
          friends {
            id
            type
          }
        }
      }
    `,
    {
      data: {
        usersInFriends: [
          {
            id: "u1",
            friends: [
              {
                id: "u2",
                type: null,
              },
            ],
          },
          {
            id: "u2",
            friends: [
              {
                id: "u1",
                type: null,
              },
            ],
          },
        ],
      },
    },
  ),
];
