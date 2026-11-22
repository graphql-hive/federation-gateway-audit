import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import prettier from "prettier";

type DotResult = {
  group: string;
  raw: string;
};

const PASSED_TEST_MARKER = ".";
const FAILED_TEST_MARKER = "X";

const expectedTestSuites = readdirSync("./src/test-suites")
  .filter((file) => statSync(join("./src/test-suites", file)).isDirectory())
  .map((file) => ({
    name: file,
    cases: 0,
  }));

const suiteNameToIndexMap = new Map(
  expectedTestSuites.map((suite, index) => [suite.name, index]),
);

const gatewayResults = readdirSync("./gateways")
  .filter((file) => statSync(join("./gateways", file)).isDirectory())
  .map((id) => {
    const gatewayDetails = JSON.parse(
      readFileSync(join("./gateways", id, "gateway.json"), "utf-8"),
    ) as { name: string; repository: string; website: string };

    const lines = readFileSync(
      join("./gateways", id, "results.txt"),
      "utf-8",
    ).split("\n");

    const dot: DotResult[] = [];

    let collectingDetails = true;
    let previousGroupName: string | null = null;
    for (const line of lines) {
      if (collectingDetails) {
        if (
          line.charAt(0) === PASSED_TEST_MARKER ||
          line.charAt(0) === FAILED_TEST_MARKER
        ) {
          if (!previousGroupName) {
            throw new Error("No previous group found");
          }

          dot.push({ group: previousGroupName, raw: line });
        } else if (line.trim() === "" || line === "---") {
          collectingDetails = false;
        } else {
          previousGroupName = line;
        }
      }
    }

    const name = gatewayDetails?.name ?? id;

    return {
      id,
      name,
      repository: gatewayDetails.repository,
      website: gatewayDetails.website,
      dot,
    };
  });

for (const gateway of gatewayResults) {
  for (const { group, raw } of gateway.dot) {
    const expectedSuiteIndex = suiteNameToIndexMap.get(group);

    if (expectedSuiteIndex === undefined) {
      throw new Error(`Unknown test suite "${group}" in ${gateway.id}`);
    }

    expectedTestSuites[expectedSuiteIndex].cases = Math.max(
      expectedTestSuites[expectedSuiteIndex].cases,
      raw.length,
    );
  }
}

const missingSuiteCaseCounts = expectedTestSuites.filter(
  (suite) => suite.cases === 0,
);

if (missingSuiteCaseCounts.length > 0) {
  throw new Error(
    `Missing case counts for suites: ${missingSuiteCaseCounts.map((suite) => suite.name).join(", ")}`,
  );
}

const normalizedGatewayResults = gatewayResults.map((gateway) => {
  const dotByGroup = new Map(gateway.dot.map((dot) => [dot.group, dot.raw]));
  const dot = expectedTestSuites.map(({ name, cases }) => {
    const raw = dotByGroup.get(name) ?? FAILED_TEST_MARKER.repeat(cases);

    return {
      group: name,
      results: raw
        .replaceAll(PASSED_TEST_MARKER, "🟢")
        .replaceAll(FAILED_TEST_MARKER, "❌"),
      passed: !raw.includes(FAILED_TEST_MARKER),
      passedCases: raw.split("").filter((char) => char === PASSED_TEST_MARKER)
        .length,
      totalCases: raw.length,
    };
  });

  const tests = dot.reduce(
    (result, suite) => {
      result.total += suite.totalCases;
      result.passed += suite.passedCases;
      return result;
    },
    { total: 0, passed: 0, failed: 0 },
  );
  tests.failed = tests.total - tests.passed;

  const groups = {
    total: dot.length,
    passed: dot.filter((suite) => suite.passed).length,
    failed: dot.filter((suite) => !suite.passed).length,
  };

  return {
    ...gateway,
    dot,
    groups,
    tests,
  };
});

normalizedGatewayResults.sort((a, b) => {
  const diff = b.tests.passed - a.tests.passed;

  if (diff !== 0) {
    // 9 -> 1
    return diff;
  }

  // A -> Z
  return a.name.localeCompare(b.name);
});

function printResult(result: { passed: number; failed: number }) {
  const scores: string[] = [];

  if (result.passed) {
    scores.push(`🟢 ${result.passed}`);
  }

  if (result.failed) {
    scores.push(`❌ ${result.failed}`);
  }

  return scores.join("  ");
}

let tableMd = `|  Gateway   | Compatibility | Test Cases | Test Suites |
| :---------------------------: | :-----------: | :----------: | :---------: |`;
let testDetailsMd = "";

// website/data.json is the contract with the-guild.dev, which renders the
// results at https://the-guild.dev/graphql/hive/federation-gateway-audit
// (the-guild-org/website fetches the file from main at build time). Fields
// may be added; renaming or removing one needs a change there first.
const jsonReport: Array<{
  name: string;
  /** Anchor of the gateway's section in REPORT.md. */
  id: string;
  website: string;
  repository: string;
  cases: { total: number; passed: number; failed: number };
  suites: { total: number; passed: number; failed: number };
}> = [];

for (const gateway of normalizedGatewayResults) {
  jsonReport.push({
    name: gateway.name,
    id: gateway.id,
    website: gateway.website,
    repository: gateway.repository,
    cases: gateway.tests,
    suites: gateway.groups,
  });

  const score = ((gateway.tests.passed * 100) / gateway.tests.total).toFixed(2);
  tableMd += `\n| [${gateway.name}](${gateway.website}) | ${score}% |  ${printResult(gateway.tests)} | ${printResult(gateway.groups)} |`;

  testDetailsMd += `\n<a id="${gateway.id}"></a>
### ${gateway.name}

- [Repository](${gateway.repository})
- [Website](${gateway.website})

<details>
<summary>Results</summary>\n`;

  for (const { group, results } of gateway.dot) {
    testDetailsMd += `<a href="./src/test-suites/${group}">${group}</a>\n<pre>${results}</pre>\n`;
  }

  testDetailsMd += `</details>\n`;
}

const reportMd = `# Compatibility Results

## Summary

${tableMd}

## Detailed Results

Take a closer look at the results for each gateway.

You can look at the full list of tests [here](./src/test-suites/). Every test id corresponds to a directory in the \`src/test-suites\` folder.
${testDetailsMd}`;

await writeFormatted("./REPORT.md", reportMd);

const readmeMd = readFileSync("./README.md", "utf-8");

const startTag = "<!-- gateways:start -->";
const endTag = "<!-- gateways:end -->";
const mdStartAt = readmeMd.indexOf(startTag);
const mdEndAt = readmeMd.indexOf(endTag);

const newReadmeMd =
  readmeMd.substring(0, mdStartAt) +
  "\n\n" +
  startTag +
  "\n\n" +
  tableMd +
  "\n\n" +
  readmeMd.substring(mdEndAt);

await writeFormatted("./README.md", newReadmeMd);

await writeFormatted("./website/data.json", JSON.stringify(jsonReport));

async function writeFormatted(filename: string, content: string) {
  writeFileSync(
    filename,
    await prettier.format(content, {
      filepath: filename,
    }),
  );
}
