import { createTest } from "../../testkit.js";

export default [
  createTest(
    /* GraphQL */ `
      query {
        a @access
        b @access
      }
    `,
    {
      data: {
        a: "a",
        b: "b",
      },
    },
  ),
];
