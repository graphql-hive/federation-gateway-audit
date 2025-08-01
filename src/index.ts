import { createRouter as createFetsRouter, Response } from "fets";
import { createServer } from "node:http";

async function getTestCases(router: ReturnType<typeof createRouter>) {
  const testCases = await Promise.all(
    [
      import("./test-suites/union-intersection/index.js"),
      import("./test-suites/simple-entity-call/index.js"),
      import("./test-suites/complex-entity-call/index.js"),
      import("./test-suites/mysterious-external/index.js"),
      import("./test-suites/simple-requires-provides/index.js"),
      import("./test-suites/override-type-interface/index.js"),
      import("./test-suites/simple-interface-object/index.js"),
      import("./test-suites/simple-override/index.js"),
      import("./test-suites/unavailable-override/index.js"),
      import("./test-suites/override-with-requires/index.js"),
      import("./test-suites/node/index.js"),
      import("./test-suites/simple-inaccessible/index.js"),
      import("./test-suites/enum-intersection/index.js"),
      import("./test-suites/input-object-intersection/index.js"),
      import("./test-suites/requires-with-fragments/index.js"),
      import("./test-suites/child-type-mismatch/index.js"),
      import("./test-suites/non-resolvable-interface-object/index.js"),
      import("./test-suites/interface-object-with-requires/index.js"),
      import("./test-suites/interface-object-indirect-extension/index.js"),
      import("./test-suites/requires-interface/index.js"),
      import("./test-suites/fed1-external-extends/index.js"),
      import("./test-suites/fed2-external-extends/index.js"),
      import("./test-suites/fed1-external-extension/index.js"),
      import("./test-suites/fed2-external-extension/index.js"),
      import("./test-suites/parent-entity-call/index.js"),
      import("./test-suites/corrupted-supergraph-node-id/index.js"),
      import("./test-suites/parent-entity-call-complex/index.js"),
      import("./test-suites/shared-root/index.js"),
      import("./test-suites/nested-provides/index.js"),
      import("./test-suites/provides-on-interface/index.js"),
      import("./test-suites/provides-on-union/index.js"),
      import("./test-suites/requires-requires/index.js"),
      import("./test-suites/include-skip/index.js"),
      import("./test-suites/circular-reference-interface/index.js"),
      import("./test-suites/typename/index.js"),
      import("./test-suites/union-interface-distributed/index.js"),
      import("./test-suites/mutations/index.js"),
      import("./test-suites/abstract-types/index.js"),
      import("./test-suites/fed1-external-extends-resolvable/index.js"),
      import("./test-suites/requires-with-argument/index.js"),
      import("./test-suites/keys-mashup/index.js"),
      import("./test-suites/null-keys/index.js"),
    ].map((i) => i.then((e) => e.default)),
  );

  testCases.sort((a, b) => a.id.localeCompare(b.id));

  const registeredNames = new Set<string>();

  for (const testCase of testCases) {
    if (registeredNames.has(testCase.id)) {
      throw new Error(`Duplicate test case id: ${testCase.id}`);
    }

    registeredNames.add(testCase.id);
    testCase.createRoutes(router);
  }

  return testCases;
}

export function serve(port: number) {
  const router = createRouter();
  const { resolve, reject, promise } = Promise.withResolvers<{
    close: VoidFunction;
  }>();

  let started = false;
  const server = createServer(router).listen(port, () => {
    started = true;
    resolve({
      close,
    });
  });

  server.once("error", (error) => {
    if (!started) {
      reject(error);
    } else {
      process.stderr.write("Server error: " + String(error));
    }
  });

  function close() {
    if (server.listening) {
      return new Promise<void>((resolve, reject) => {
        server.closeAllConnections();
        server.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
  }

  server.once("close", () => {
    console.log("Server closed");
  });

  process.once("exit", () => {
    close();
  });

  process.once("SIGINT", () => {
    close();
  });

  process.once("SIGTERM", () => {
    close();
  });

  return promise;
}

export function createRouter() {
  const router = createFetsRouter({
    landingPage: false,
    swaggerUI: {
      endpoint: "/",
      displayOperationId: false,
    },
    openAPI: {
      info: {
        title: "Federation Compatibility Test Suite",
        description:
          "A test suite for validating Apollo Federation v2 compatibility",
        contact: {
          name: "The Guild",
          url: "https://the-guild.dev",
          email: "contact@the-guild.dev",
        },
      },
    },
  })
    .route({
      method: "GET",
      path: "/_health",
      handler() {
        return new Response("OK");
      },
    })
    .route({
      method: "GET",
      path: "/ids",
      operationId: "get_ids",
      description: "A list of test cases",
      tags: ["root"],
      schemas: {
        responses: {
          200: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
      handler() {
        return testCases$.then((testCases) =>
          Response.json(testCases.map((t) => t.id)),
        );
      },
    })
    .route({
      method: "GET",
      path: "/supergraphs",
      description: "A list of supergraph endpoints",
      tags: ["root"],
      schemas: {
        responses: {
          200: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
      handler(req) {
        return testCases$.then((testCases) =>
          Response.json(
            testCases.map(
              ({ id }) => `${req.parsedUrl.origin}/${id}/supergraph`,
            ),
          ),
        );
      },
    })
    .route({
      method: "GET",
      path: "/tests",
      description: "A list of endpoints with tests",
      tags: ["root"],
      schemas: {
        responses: {
          200: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
      handler(req) {
        return testCases$.then((testCases) =>
          Response.json(
            testCases.map(({ id }) => `${req.parsedUrl.origin}/${id}/tests`),
          ),
        );
      },
    })
    .route({
      method: "GET",
      path: "/subgraphs",
      description: "A list of endpoints with subgraphs",
      tags: ["root"],
      schemas: {
        responses: {
          200: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
      handler(req) {
        return testCases$.then((testCases) =>
          Response.json(
            testCases.map(
              ({ id }) => `${req.parsedUrl.origin}/${id}/subgraphs`,
            ),
          ),
        );
      },
    });

  const testCases$ = getTestCases(router);

  return router;
}
