import { ExecutionResult } from "graphql";
import type { createTest } from "./testkit.js";
import { diff } from "jest-diff";
import { test } from "node:test";
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

const TESTS_ENDPOINT = process.env.TESTS_ENDPOINT;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;

assert(TESTS_ENDPOINT, "TESTS_ENDPOINT is required");
assert(GRAPHQL_ENDPOINT, "GRAPHQL_ENDPOINT is required");

console.log(`Using gateway at     ${GRAPHQL_ENDPOINT}`);
console.log(`Fetching tests from  ${TESTS_ENDPOINT}`);
console.log(`\n`);

const tests = await fetchTests(TESTS_ENDPOINT);

let index = 0;
for (const { query, expected: expectedResult } of tests) {
  test(`${index++}`, async () => {
    const response = await graphql(GRAPHQL_ENDPOINT, query);

    const received = {
      data: response.data ?? null,
      errors: response.errors?.length ? true : false,
    };

    const expected = {
      data: expectedResult.data ?? null,
      errors: expectedResult.errors ?? false,
    };

    deepStrictEqual(
      received,
      expected,
      [`Test failed for query`, query, diff(expected, received)].join("\n"),
    );
  });
}

function graphql(endpoint: string, query: string) {
  return fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json()) as Promise<ExecutionResult>;
}

function assert(value: unknown, message: string): asserts value {
  if (!value) {
    throw new Error(message);
  }
}
