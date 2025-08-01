import { createTest } from "../../testkit.js";

export default [
  createTest(
    /* GraphQL */ `
      query {
        products {
          ... on Node {
            id
          }
        }
      }
    `,
    {
      data: {
        products: [
          {
            id: "oven1",
          },
          {
            id: "oven2",
          },
          {
            id: "toaster1",
          },
          {
            id: "toaster2",
          },
        ],
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        nodes {
          ... on Toaster {
            warranty
          }
          ... on Oven {
            id
          }
        }
      }
    `,
    {
      data: {
        nodes: [
          {
            warranty: 3,
          },
          {
            warranty: 4,
          },
        ],
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        nodes {
          id
        }
      }
    `,
    {
      data: {
        nodes: [
          {
            id: "toaster1",
          },
          {
            id: "toaster2",
          },
        ],
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        nodes {
          ... on Node {
            id
          }
        }
      }
    `,
    {
      data: {
        nodes: [
          {
            id: "toaster1",
          },
          {
            id: "toaster2",
          },
        ],
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        nodes {
          ... on Node {
            ... on WithWarranty {
              warranty
            }
          }
        }
      }
    `,
    {
      data: {
        nodes: [
          {
            warranty: 3,
          },
          {
            warranty: 4,
          },
        ],
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        nodes {
          ... on Node {
            id
            ... on Node {
              id
              ... on WithWarranty {
                warranty
              }
            }
          }
        }
      }
    `,
    {
      data: {
        nodes: [
          {
            id: "toaster1",
            warranty: 3,
          },
          {
            id: "toaster2",
            warranty: 4,
          },
        ],
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      {
        toasters {
          ...ToasterFragment
          ...NodeFragment
        }
      }

      fragment ToasterFragment on Toaster {
        id
      }

      fragment NodeFragment on Node {
        id
        __typename
      }
    `,
    {
      data: {
        toasters: [
          {
            id: "toaster1",
            __typename: "Toaster",
          },
          {
            id: "toaster2",
            __typename: "Toaster",
          },
        ],
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        node(id: "oven1") {
          ... on Oven {
            warranty
          }
        }
      }
    `,
    {
      data: {
        node: null,
      },
      errors: true,
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        node(id: "oven1") {
          ... on Toaster {
            warranty
          }
        }
      }
    `,
    {
      data: {
        node: null,
      },
      errors: true,
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        node(id: "toaster1") {
          ... on Toaster {
            warranty
          }
        }
      }
    `,
    {
      data: {
        node: {
          warranty: 3,
        },
      },
    },
  ),
];
