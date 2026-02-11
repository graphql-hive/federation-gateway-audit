import { createTest } from "../../testkit.js";
import { users } from "./data.js";

export default [
  // Test basic entity resolution across subgraphs
  // Verifies that a User entity can be resolved by fetching data from multiple subgraphs:
  // - The 'email' subgraph provides the user query and id field
  // - The 'nickname' subgraph provides the nickname field using @external email as key
  // This tests the fundamental Apollo Federation capability of entity resolution
  createTest(
    /* GraphQL */ `
      query {
        user {
          id
          nickname
        }
      }
    `,
    {
      data: {
        user: {
          id: users[0].id,
          nickname: users[0].nickname,
        },
      },
    },
  ),
];
