import { createTest } from "../../testkit.js";

export default [
  createTest(
    /* GraphQL */ `
      query {
        randomUser {
          id
          name
        }
        userById(id: "u2") {
          id
          name
          nickname
        }
      }
    `,
    {
      data: {
        randomUser: {
          id: "u1",
          name: "u1-name",
        },
        userById: {
          id: "u2",
          name: "u2-name",
          nickname: "u2-nickname",
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        randomUser {
          id
          rid
        }
      }
    `,
    {
      data: {
        randomUser: {
          id: "u1",
          rid: "u1-rid",
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        randomUser {
          id
          rid
          name
        }
      }
    `,
    {
      data: {
        randomUser: {
          id: "u1",
          rid: "u1-rid",
          name: "u1-name",
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        providedRandomUser {
          id
          rid
          name
        }
      }
    `,
    {
      data: {
        providedRandomUser: {
          id: "u1",
          rid: "u1-rid",
          name: "u1-name",
        },
      },
    },
  ),
];
