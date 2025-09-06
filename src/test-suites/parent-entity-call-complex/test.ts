import { createTest } from "../../testkit.js";

export default [
  // Test complex parent entity resolution with computed fields
  // Verifies that entities can resolve fields that depend on data from parent entities
  // - productFromD query starts from subgraph D
  // - Product entity gets name from one subgraph  
  // - Category entity gets name and details from different subgraphs
  // - details field is computed based on the product name
  // This tests complex federation scenarios where child entities need parent data
  createTest(
    /* GraphQL */ `
      query {
        productFromD(id: "1") {
          id
          name
          category {
            id
            name
            details
          }
        }
      }
    `,
    {
      data: {
        productFromD: {
          id: "1",
          name: "Product#1",
          category: {
            id: "3",
            name: "Category#3",
            details: "Details for Product#1",
          },
        },
      },
    },
  ),
];
