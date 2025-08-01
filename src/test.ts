import { ExecutionResult } from "graphql";
import type { createTest } from "./testkit.js";
import { diff } from "jest-diff";
import { it, describe } from "node:test";
import { deepStrictEqual } from "node:assert";

async function fetchTests(endpoint: string) {
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status !== 200) {
    throw new Error(
      `Failed to fetch tests ${response.status} ${response.statusText}`,
    );
  }

  const result = await response.json();

  return result as Array<ReturnType<typeof createTest>>;
}

const TEST_SUITE = process.env.TEST_SUITE;
const TESTS_ENDPOINT = process.env.TESTS_ENDPOINT;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;

assert(TESTS_ENDPOINT, "TESTS_ENDPOINT is required");
assert(GRAPHQL_ENDPOINT, "GRAPHQL_ENDPOINT is required");

console.log(`Using gateway at     ${GRAPHQL_ENDPOINT}`);
console.log(`Fetching tests from  ${TESTS_ENDPOINT}`);
console.log(`\n`);

const tests = await fetchTests(TESTS_ENDPOINT);

let index = 0;
describe(TEST_SUITE, () => {
  for (const { query, expected: expectedResult } of tests) {
    it(`${TEST_SUITE}_${index++}`, async () => {
      const response = await graphql(GRAPHQL_ENDPOINT, query);

      const errorsOptional = typeof expectedResult.errors !== "boolean";

      const received = {
        data: response.data ?? null,
        errors: errorsOptional ? null : response.errors?.length ? true : false,
      };

      const expected = {
        data: expectedResult.data ?? null,
        errors: errorsOptional ? null : (expectedResult.errors ?? false),
      };

      let retryCount = 0;
      const maxRetries = 2;
      let testPassed = false;

      while (retryCount <= maxRetries && !testPassed) {
        try {
          deepStrictEqual(
            received,
            expected,
            [`Test failed for query`, query, diff(expected, received)].join(
              "\n",
            ),
          );
          testPassed = true;
        } catch (error) {
          if (retryCount === maxRetries) {
            throw error;
          }
          retryCount++;
        }
      }
    });
  }
});

function graphql(endpoint: string, query: string) {
  return fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(10_000),
  }).then((response) => response.json()) as Promise<ExecutionResult>;
}

function assert(value: unknown, message: string): asserts value {
  if (!value) {
    throw new Error(message);
  }
}
