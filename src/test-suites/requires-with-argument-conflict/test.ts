import { createTest } from "../../testkit.js";

export default [
  createTest(
    /* GraphQL */ `
      query {
        products {
          upc
          name
          shippingEstimate
          shippingEstimateEUR
          isExpensiveCategory
        }
      }
    `,
    {
      data: {
        products: [
          {
            upc: "p1",
            name: "p-name-1",
            shippingEstimate: 110, // 11 * 1 * 10
            shippingEstimateEUR: 220, // (11 * 2) * 1 * 10
            isExpensiveCategory: false,
          },
          {
            upc: "p2",
            name: "p-name-2",
            shippingEstimate: 440, // 22 * 2 * 10
            shippingEstimateEUR: 880, // (22 * 2) * 2 * 10
            isExpensiveCategory: true,
          },
        ],
      },
    },
  ),
];
