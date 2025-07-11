import { createTest } from "../../testkit.js";

export default [
  createTest(
    /* GraphQL */ `
      query {
        media {
          id
          title
          ... on Video {
            duration
            authorName
          }
          ... on Article {
            wordCount
          }
        }
        author {
          id
          name
        }
        playlist {
          id
          name
          media {
            id
            ... on Video {
              duration
            }
          }
        }
      }
    `,
    {
      data: {
        media: {
          id: "1",
          title: "title for 1",
          duration: 100,
          authorName: "John Doe",
        },
        author: {
          id: "1",
          name: "name for 1",
        },
        playlist: {
          id: "1",
          name: "name for 1",
          media: {
            id: "1",
            duration: 100,
          },
        },
      },
    },
  ),
];
