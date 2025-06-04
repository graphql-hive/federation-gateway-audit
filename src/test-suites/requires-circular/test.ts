import { createTest } from "../../testkit.js";

export default [
  createTest(
    /* GraphQL */ `
      {
        feed {
          byNovice
        }
      }
    `,
    {
      data: {
        feed: [
          {
            byNovice: true,
          },
          {
            byNovice: false,
          },
        ],
      },
    }
  ),
  createTest(
    /* GraphQL */ `
      {
        feed {
          byExpert
        }
      }
    `,
    {
      data: {
        feed: [
          {
            byExpert: false,
          },
          {
            byExpert: true,
          },
        ],
      },
    }
  ),
];
