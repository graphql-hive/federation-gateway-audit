import { createTest } from "../../test";

export default [
  createTest(
    /* GraphQL */ `
      query ($bool: Boolean = false) {
        product {
          price
          neverCalledInclude @include(if: $bool)
        }
      }
    `,
    {
      data: {
        product: {
          price: 699.99,
        },
      },
    },
    /* GraphQL */ `
    QueryPlan {
      Sequence {
        Fetch(service: "a") {
          {
            product {
              __typename
              id
              price
              ... on Product @include(if: $bool) {
                __typename
                id
                price
              }
            }
          }
        },
        Include(if: $bool) {
          Sequence {
            Flatten(path: "product") {
              Fetch(service: "b") {
                {
                  ... on Product {
                    __typename
                    price
                    id
                  }
                } =>
                {
                  ... on Product {
                    isExpensive
                  }
                }
              },
            },
            Flatten(path: "product") {
              Fetch(service: "c") {
                {
                  ... on Product {
                    __typename
                    isExpensive
                    id
                  }
                } =>
                {
                  ... on Product {
                    neverCalledInclude
                  }
                }
              },
            },
          }
        },
      },
    }
    `
  ),
  createTest(
    /* GraphQL */ `
      query ($bool: Boolean = true) {
        product {
          price
          neverCalledSkip @skip(if: $bool)
        }
      }
    `,
    {
      data: {
        product: {
          price: 699.99,
        },
      },
    },
    /* GraphQL */ `
    QueryPlan {
      Sequence {
        Fetch(service: "a") {
          {
            product {
              __typename
              id
              price
              ... on Product @skip(if: $bool) {
                __typename
                id
                price
              }
            }
          }
        },
        Skip(if: $bool) {
          Sequence {
            Flatten(path: "product") {
              Fetch(service: "b") {
                {
                  ... on Product {
                    __typename
                    price
                    id
                  }
                } =>
                {
                  ... on Product {
                    isExpensive
                  }
                }
              },
            },
            Flatten(path: "product") {
              Fetch(service: "c") {
                {
                  ... on Product {
                    __typename
                    isExpensive
                    id
                  }
                } =>
                {
                  ... on Product {
                    neverCalledSkip
                  }
                }
              },
            },
          }
        },
      },
    }
    `
  ),
  createTest(
    /* GraphQL */ `
      query ($bool: Boolean = true) {
        product {
          price
          include @include(if: $bool)
        }
      }
    `,
    {
      data: {
        product: {
          price: 699.99,
          include: true,
        },
      },
    },
    /* GraphQL */ `
    QueryPlan {
      Sequence {
        Fetch(service: "a") {
          {
            product {
              __typename
              id
              price
              ... on Product @include(if: $bool) {
                __typename
                id
                price
              }
            }
          }
        },
        Include(if: $bool) {
          Sequence {
            Flatten(path: "product") {
              Fetch(service: "b") {
                {
                  ... on Product {
                    __typename
                    price
                    id
                  }
                } =>
                {
                  ... on Product {
                    isExpensive
                  }
                }
              },
            },
            Flatten(path: "product") {
              Fetch(service: "c") {
                {
                  ... on Product {
                    __typename
                    isExpensive
                    id
                  }
                } =>
                {
                  ... on Product {
                    include
                  }
                }
              },
            },
          }
        },
      },
    }
    `
  ),
  createTest(
    /* GraphQL */ `
      query ($bool: Boolean = false) {
        product {
          price
          skip @skip(if: $bool)
        }
      }
    `,
    {
      data: {
        product: {
          price: 699.99,
          skip: true,
        },
      },
    },
    /* GraphQL */ `
    QueryPlan {
      Sequence {
        Fetch(service: "a") {
          {
            product {
              __typename
              id
              price
              ... on Product @skip(if: $bool) {
                __typename
                id
                price
              }
            }
          }
        },
        Skip(if: $bool) {
          Sequence {
            Flatten(path: "product") {
              Fetch(service: "b") {
                {
                  ... on Product {
                    __typename
                    price
                    id
                  }
                } =>
                {
                  ... on Product {
                    isExpensive
                  }
                }
              },
            },
            Flatten(path: "product") {
              Fetch(service: "c") {
                {
                  ... on Product {
                    __typename
                    isExpensive
                    id
                  }
                } =>
                {
                  ... on Product {
                    skip
                  }
                }
              },
            },
          }
        },
      },
    }
    `
  ),
];
