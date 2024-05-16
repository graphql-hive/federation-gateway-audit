/**
 * $ npm run test-all
 */

import { ExecutionResult } from "graphql";
import stripIndent from "strip-indent";
import { fetchTests } from "./src/test";
import { diff } from "jest-diff";
import { describe, test } from "node:test";
import { deepStrictEqual } from "node:assert";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:4200";
const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://localhost:4000";
const testsEndpoint = `${BASE_URL}/tests`;

console.log(`Using gateway at     ${GATEWAY_URL}`);
console.log(`Fetching tests from  ${testsEndpoint}`);
console.log(`\n`);

async function fetchTestList() {
  const url = BASE_URL + "/tests";
  const response = await fetch(url);
  const links: string[] = await response.json();

  return links.map((link) => ({
    id: link.replace(BASE_URL + "/", "").replace("/tests", ""),
    testEndpoint: link,
  }));
}

const testList = await fetchTestList();

for (const { id, testEndpoint } of testList) {
  describe(id, async () => {
    const tests = await fetchTests(testEndpoint);

    let index = 0;
    for (const {
      query,
      expected: expectedResult,
      plan: expectedPlan,
    } of tests) {
      test(`${index++}`, async () => {
        const response = await graphql(GATEWAY_URL + "/" + id, query);

        const received = {
          data: response.data ?? null,
          errors: response.errors?.length ? true : false,
          plan: normalizePlan(
            expectedPlan
              ? (response.extensions?.plan as string | undefined) ?? null
              : null
          ),
        };

        const expected = {
          data: expectedResult.data ?? null,
          errors: expectedResult.errors ?? false,
          plan: normalizePlan(expectedPlan ?? null),
        };

        deepStrictEqual(
          expected,
          received,
          [`Test failed for query`, query, diff(expected, received)].join("\n")
        );
      });
    }
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

function normalizePlan(plan: string | undefined | null) {
  if (!plan) {
    return null;
  }

  return stripIndent(
    plan
      .split("\n")
      .map((line) => {
        // remove comments
        if (line.includes("#")) {
          return line.split("#")[0];
        }

        return line;
      })
      .filter((line) => line.trim() !== "")
      .join("\n")
  );
}
