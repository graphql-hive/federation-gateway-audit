import { createTest } from "../../testkit.js";

export default [
  createTest(
    /* GraphQL */ `
      {
        feed {
          author {
            id
          }
        }
      }
    `,
    {
      data: {
        feed: [
          {
            author: {
              id: "a2",
            },
          },
          {
            author: {
              id: "a1",
            },
          },
        ],
      },
    }
  ),
];
