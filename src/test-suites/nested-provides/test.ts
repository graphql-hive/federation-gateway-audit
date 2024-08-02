import { createTest } from "../../testkit.js";

export default [
  createTest(
    /* GraphQL */ `
      query {
        products {
          id
          categories {
            id
            name
          }
        }
      }
    `,
    {
      data: {
        products: [
          {
            id: "p1",
            categories: [
              {
                id: "c1",
                name: "Category 1",
              },
              {
                id: "c2",
                name: "Category 2",
              },
            ],
          },
          {
            id: "p2",
            categories: [
              {
                id: "c3",
                name: "Category 3",
              },
              {
                id: "c2",
                name: "Category 2",
              },
            ],
          },
        ],
      },
    }
  ),
  createTest(
    /* GraphQL */ `
      query {
        products {
          id
          categories {
            id
            name
            subCategories {
              id
              name
            }
          }
        }
      }
    `,
    {
      data: {
        products: [
          {
            id: "p1",
            categories: [
              {
                id: "c1",
                name: "Category 1",
                subCategories: [
                  {
                    id: "c2",
                    name: "Category 2",
                  },
                ],
              },
              {
                id: "c2",
                name: "Category 2",
                subCategories: [
                  {
                    id: "c3",
                    name: "Category 3",
                  },
                ],
              },
            ],
          },
          {
            id: "p2",
            categories: [
              {
                id: "c3",
                name: "Category 3",
                subCategories: [
                  {
                    id: "c1",
                    name: "Category 1",
                  },
                ],
              },
              {
                id: "c2",
                name: "Category 2",
                subCategories: [
                  {
                    id: "c3",
                    name: "Category 3",
                  },
                ],
              },
            ],
          },
        ],
      },
    }
  ),
];
