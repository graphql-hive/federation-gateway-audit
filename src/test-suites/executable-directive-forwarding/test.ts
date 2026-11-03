import { createTest } from "../../testkit.js";

// Both subgraphs define the same executable directive
// `@access(scope: Scope! = PUBLIC) on FIELD`, so composition keeps it in the
// supergraph and a gateway has to forward it, with its argument, to every
// subgraph it sends the annotated field to. Each resolver returns the scope it
// effectively received.
export default [
  // An explicit argument is forwarded as-is.
  createTest(
    /* GraphQL */ `
      query {
        a @access(scope: PRIVATE)
        b @access(scope: PRIVATE)
      }
    `,
    {
      data: {
        a: "a:PRIVATE",
        b: "b:PRIVATE",
      },
    },
  ),
  // An argument given through a variable is forwarded with its value.
  createTest(
    /* GraphQL */ `
      query ($scope: Scope!) {
        a @access(scope: $scope)
        b @access(scope: $scope)
      }
    `,
    {
      data: {
        a: "a:PRIVATE",
        b: "b:PRIVATE",
      },
    },
    { scope: "PRIVATE" },
  ),
  // A bare `@access` relies on the composed default. Forwarding it bare or
  // materializing `scope: PUBLIC` are both fine, dropping it is not.
  createTest(
    /* GraphQL */ `
      query {
        a @access
        b @access
      }
    `,
    {
      data: {
        a: "a:PUBLIC",
        b: "b:PUBLIC",
      },
    },
  ),
  // Fields without the directive must not receive one.
  createTest(
    /* GraphQL */ `
      query {
        a
        b
      }
    `,
    {
      data: {
        a: "a:NO_DIRECTIVE",
        b: "b:NO_DIRECTIVE",
      },
    },
  ),
];
