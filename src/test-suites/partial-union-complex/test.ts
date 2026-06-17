import { createTest } from "../../testkit.js";
import { common, onlyA, onlyB } from "./data.js";

export default [
  createTest(
    /* GraphQL */ `
      query {
        rootA {
          wrapper {
            actions {
              __typename
              ... on Common {
                label
              }
              ... on OnlyA {
                a
              }
              ... on OnlyB {
                b
              }
            }
          }
        }
      }
    `,
    {
      data: {
        rootA: {
          wrapper: {
            actions: [
              {
                __typename: common.__typename,
                label: common.label,
              },
              {
                __typename: onlyA.__typename,
                a: onlyA.a,
              },
            ],
          },
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        rootB {
          wrapper {
            actions {
              __typename
              ... on Common {
                label
              }
              ... on OnlyA {
                a
              }
              ... on OnlyB {
                b
              }
            }
          }
        }
      }
    `,
    {
      data: {
        rootB: {
          wrapper: {
            actions: [
              {
                __typename: common.__typename,
                label: common.label,
              },
              {
                __typename: onlyB.__typename,
                b: onlyB.b,
              },
            ],
          },
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        rootA {
          wrapper {
            actions {
              __typename
              ... on OnlyB {
                b
              }
            }
          }
        }
      }
    `,
    {
      data: {
        rootA: {
          wrapper: {
            actions: [
              {
                __typename: common.__typename,
              },
              {
                __typename: onlyA.__typename,
              },
            ],
          },
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        shared {
          wrapper {
            actions {
              __typename
              ... on Common {
                label
              }
              ... on OnlyA {
                a
              }
              ... on OnlyB {
                b
              }
            }
          }
        }
      }
    `,
    {
      data: {
        shared: {
          wrapper: {
            actions: [
              {
                __typename: common.__typename,
                label: common.label,
              },
            ],
          },
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        rootA {
          bWrapper {
            actions {
              __typename
              ... on Common {
                label
              }
              ... on OnlyA {
                a
              }
              ... on OnlyB {
                b
              }
            }
          }
        }
      }
    `,
    {
      data: {
        rootA: {
          bWrapper: {
            actions: [
              {
                __typename: common.__typename,
                label: common.label,
              },
              {
                __typename: onlyB.__typename,
                b: onlyB.b,
              },
            ],
          },
        },
      },
    },
  ),
];
