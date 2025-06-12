import { createTest } from "../../testkit.js";
import { media } from "./data.js";

export default [
  createTest(
    /* GraphQL */ `
      query {
        media {
          ... on Movie {
            title
          }
        }
      }
    `,
    {
      data: {
        media: {},
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        media {
          ... on Book {
            title
          }
        }
      }
    `,
    {
      data: {
        media: {
          title: media.title,
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        media {
          ... on Book {
            title
          }
          ... on Movie {
            title
          }
        }
      }
    `,
    {
      data: {
        media: {
          title: media.title,
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        viewer {
          media {
            __typename
            ... on Song {
              title
            }
            ... on Movie {
              title
            }
            ... on Book {
              title
            }
          }
          book {
            __typename
            ... on Song {
              title
            }
            ... on Movie {
              title
            }
            ... on Book {
              title
            }
          }
          song {
            __typename
            ... on Song {
              title
            }
            ... on Movie {
              title
            }
            ... on Book {
              title
            }
          }
        }
      }
    `,
    {
      data: {
        viewer: {
          media: {
            __typename: "Book",
            title: "The Lord of the Rings",
          },
          book: {
            __typename: "Book",
            title: "The Lord of the Rings",
          },
          song: {
            __typename: "Song",
            title: "Song Title",
          },
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        viewer {
          media {
            ... on Movie {
              title
            }
          }
        }
      }
    `,
    {
      data: {
        viewer: {
          media: {},
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        viewer {
          media {
            ... on Book {
              title
            }
          }
        }
      }
    `,
    {
      data: {
        viewer: {
          media: {
            title: media.title,
          },
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        viewer {
          media {
            ... on Book {
              title
            }
            ... on Movie {
              title
            }
          }
        }
      }
    `,
    {
      data: {
        viewer: {
          media: {
            title: media.title,
          },
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        viewer {
          media {
            __typename
            ... on Song {
              title
            }
            ... on Movie {
              title
            }
            ... on Book {
              title
            }
          }
          book {
            __typename
            ... on Song {
              title
            }
            ... on Movie {
              title
            }
            ... on Book {
              title
            }
          }
          song {
            __typename
            ... on Song {
              title
            }
            ... on Movie {
              title
            }
            ... on Book {
              title
            }
          }
        }
      }
    `,
    {
      data: {
        viewer: {
          media: {
            __typename: "Book",
            title: "The Lord of the Rings",
          },
          book: {
            __typename: "Book",
            title: "The Lord of the Rings",
          },
          song: {
            __typename: "Song",
            title: "Song Title",
          },
        },
      },
    },
  ),
  // this part involves entity calls
  createTest(
    /* GraphQL */ `
      query {
        aMedia {
          ... on Movie {
            title
            bTitle
          }
        }
      }
    `,
    {
      data: {
        aMedia: {},
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        aMedia {
          ... on Book {
            title
            aTitle
            bTitle
          }
        }
      }
    `,
    {
      data: {
        aMedia: {
          title: media.title,
          aTitle: media.aTitle,
          bTitle: media.bTitle,
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        viewer {
          media {
            __typename
            ... on Song {
              title
              aTitle
            }
            ... on Movie {
              title
              bTitle
            }
            ... on Book {
              title
              aTitle
              bTitle
            }
          }
          book {
            __typename
            ... on Song {
              title
              aTitle
            }
            ... on Movie {
              title
              bTitle
            }
            ... on Book {
              title
              aTitle
              bTitle
            }
          }
          song {
            __typename
            ... on Song {
              title
              aTitle
            }
            ... on Movie {
              title
              bTitle
            }
            ... on Book {
              title
              aTitle
              bTitle
            }
          }
        }
      }
    `,
    {
      data: {
        viewer: {
          media: {
            __typename: "Book",
            title: "The Lord of the Rings",
            aTitle: "A: The Lord of the Rings",
            bTitle: "B: The Lord of the Rings",
          },
          book: {
            __typename: "Book",
            title: "The Lord of the Rings",
            aTitle: "A: The Lord of the Rings",
            bTitle: "B: The Lord of the Rings",
          },
          song: {
            __typename: "Song",
            title: "Song Title",
            aTitle: "A: Song Title",
          },
        },
      },
    },
  ),
  createTest(
    /* GraphQL */ `
      query {
        viewer {
          aMedia {
            ... on Movie {
              title
              bTitle
            }
          }
          bMedia {
            ... on Movie {
              title
              bTitle
            }
          }
        }
      }
    `,
    {
      data: {
        viewer: {
          aMedia: {},
          bMedia: {
            title: "A Movie Title",
            bTitle: "B Movie Title",
          },
        },
      },
    },
  ),
];
