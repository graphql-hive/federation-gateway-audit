# @graphql-hive/federation-gateway-audit

## 0.0.4

### Patch Changes

- [#369](https://github.com/graphql-hive/federation-gateway-audit/pull/369) [`9c874b9`](https://github.com/graphql-hive/federation-gateway-audit/commit/9c874b9ed250d0715f04c3def41abdca596e2788) Thanks [@Urigo](https://github.com/Urigo)! - dependencies updates:
  - Updated dependency [`@apollo/composition@2.14.4` ↗︎](https://www.npmjs.com/package/@apollo/composition/v/2.14.4) (from `2.14.1`, in `dependencies`)
  - Updated dependency [`@apollo/subgraph@2.15.1` ↗︎](https://www.npmjs.com/package/@apollo/subgraph/v/2.15.1) (from `2.14.1`, in `dependencies`)
  - Updated dependency [`fets@^0.8.12` ↗︎](https://www.npmjs.com/package/fets/v/0.8.12) (from `^0.8.5`, in `dependencies`)
  - Updated dependency [`get-port@^7.2.0` ↗︎](https://www.npmjs.com/package/get-port/v/7.2.0) (from `^7.1.0`, in `dependencies`)
  - Updated dependency [`graphql-yoga@^6.0.1` ↗︎](https://www.npmjs.com/package/graphql-yoga/v/6.0.1) (from `^5.18.1`, in `dependencies`)
  - Updated dependency [`jest-diff@^30.5.2` ↗︎](https://www.npmjs.com/package/jest-diff/v/30.5.2) (from `^30.3.0`, in `dependencies`)
  - Updated dependency [`kill-port-process@^5.0.0` ↗︎](https://www.npmjs.com/package/kill-port-process/v/5.0.0) (from `^4.0.2`, in `dependencies`)
  - Updated dependency [`wait-on@^9.5.1` ↗︎](https://www.npmjs.com/package/wait-on/v/9.5.1) (from `^9.0.4`, in `dependencies`)
  - Updated dependency [`yargs@^18.2.0` ↗︎](https://www.npmjs.com/package/yargs/v/18.2.0) (from `^18.0.0`, in `dependencies`)

- [#369](https://github.com/graphql-hive/federation-gateway-audit/pull/369) [`9c874b9`](https://github.com/graphql-hive/federation-gateway-audit/commit/9c874b9ed250d0715f04c3def41abdca596e2788) Thanks [@Urigo](https://github.com/Urigo)! - Point the CLI help and the generated report links at the `graphql-hive/federation-gateway-audit` repository, and adapt the audit server to `graphql-yoga@6` and `@apollo/subgraph@2.15`.

- [#360](https://github.com/graphql-hive/federation-gateway-audit/pull/360) [`28acdc1`](https://github.com/graphql-hive/federation-gateway-audit/commit/28acdc15f57a8f28892fa5337b2e906d9e3185e9) Thanks [@rhino88](https://github.com/rhino88)! - Adds new test suite: `union-overfetching`

- [#361](https://github.com/graphql-hive/federation-gateway-audit/pull/361) [`bda2306`](https://github.com/graphql-hive/federation-gateway-audit/commit/bda23069e174193737c9afc296cf075fd9f6d101) Thanks [@rhino88](https://github.com/rhino88)! - Adds new test suite: `skip-entity-fetch`. Tests can now send `variables` with their query.

## 0.0.3

### Patch Changes

- [#345](https://github.com/graphql-hive/federation-gateway-audit/pull/345) [`f8108df`](https://github.com/graphql-hive/federation-gateway-audit/commit/f8108df29f110f01af226b825ebf5bd93e3f93bc) Thanks [@dotansimha](https://github.com/dotansimha)! - dependencies updates:
  - Updated dependency [`@apollo/composition@2.14.1` ↗︎](https://www.npmjs.com/package/@apollo/composition/v/2.14.1) (from `^2.13.2`, in `dependencies`)
  - Updated dependency [`@apollo/subgraph@2.14.1` ↗︎](https://www.npmjs.com/package/@apollo/subgraph/v/2.14.1) (from `^2.13.2`, in `dependencies`)

- [`5f38191`](https://github.com/graphql-hive/federation-gateway-audit/commit/5f38191a9ad2ae07c1694aee8ca2ce5b95addbbe) Thanks [@dotansimha](https://github.com/dotansimha)! - Adds 2 new test suites: `partial-union`, `partial-union-complex`

## 0.0.2

### Patch Changes

- [#302](https://github.com/graphql-hive/federation-gateway-audit/pull/302) [`648533e`](https://github.com/graphql-hive/federation-gateway-audit/commit/648533ede147c75838cd06644d0012adccf94f02) Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency [`@apollo/composition@2.13.2` ↗︎](https://www.npmjs.com/package/@apollo/composition/v/2.13.2) (from `2.13.1`, in `dependencies`)
  - Updated dependency [`@apollo/subgraph@2.13.2` ↗︎](https://www.npmjs.com/package/@apollo/subgraph/v/2.13.2) (from `2.13.1`, in `dependencies`)

- [#305](https://github.com/graphql-hive/federation-gateway-audit/pull/305) [`e6501b6`](https://github.com/graphql-hive/federation-gateway-audit/commit/e6501b6306a7a6280083d438ded92920659a7584) Thanks [@ardatan](https://github.com/ardatan)! - Fix \`test\` command of CLI

## 0.0.1

### Patch Changes

- [#293](https://github.com/graphql-hive/federation-gateway-audit/pull/293) [`7780068`](https://github.com/graphql-hive/federation-gateway-audit/commit/77800684f9f77eeb0c764c11d918de98951df2fb) Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Removed dependency [`dotenv@17.3.1` ↗︎](https://www.npmjs.com/package/dotenv/v/17.3.1) (from `dependencies`)

- [#293](https://github.com/graphql-hive/federation-gateway-audit/pull/293) [`7780068`](https://github.com/graphql-hive/federation-gateway-audit/commit/77800684f9f77eeb0c764c11d918de98951df2fb) Thanks [@ardatan](https://github.com/ardatan)! - Remove \`dotenv\` dependency, and use the native \`process.loadEnvFile\`
