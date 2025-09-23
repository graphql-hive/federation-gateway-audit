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
            shippingEstimate: 110,
            shippingEstimateEUR: 165,
            isExpensiveCategory: false,
          },
          {
            upc: "p2",
            name: "p-name-2",
            shippingEstimate: 440,
            shippingEstimateEUR: 660,
            isExpensiveCategory: true,
          },
        ],
      },
    },
  ),
];
