import { createTest } from "../../testkit.js";
import { alpha, beta, gamma, message } from "./data.js";

export default [
  // The query selects all three union members. `Beta` and `Gamma` exist only
  // in the primary subgraph and have no `@key`, so they can only be resolved
  // there. A correct gateway keeps every inline fragment and returns all three.
  createTest(
    /* GraphQL */ `
      query {
        getResponse {
          message
          actions {
            __typename
            ... on Alpha {
              id
              value
            }
            ... on Beta {
              id
              name
              details
            }
            ... on Gamma {
              id
              label
            }
          }
        }
      }
    `,
    {
      data: {
        getResponse: {
          message,
          actions: [
            {
              __typename: alpha.__typename,
              id: alpha.id,
              value: alpha.value,
            },
            {
              __typename: beta.__typename,
              id: beta.id,
              name: beta.name,
              details: beta.details,
            },
            {
              __typename: gamma.__typename,
              id: gamma.id,
              label: gamma.label,
            },
          ],
        },
      },
    },
  ),
  // Selecting only the members missing from the secondary subgraph must still
  // resolve them from the primary subgraph.
  createTest(
    /* GraphQL */ `
      query {
        getResponse {
          actions {
            __typename
            ... on Beta {
              name
            }
            ... on Gamma {
              label
            }
          }
        }
      }
    `,
    {
      data: {
        getResponse: {
          actions: [
            { __typename: alpha.__typename },
            { __typename: beta.__typename, name: beta.name },
            { __typename: gamma.__typename, label: gamma.label },
          ],
        },
      },
    },
  ),
];
