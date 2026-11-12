# Federation-Compatible Gateway Implementations

This repository contains a set of tests to evaluate and compare the compatibility of different GraphQL gateways with Apollo Federation.

[🌐 See the results of our audit](https://the-guild.dev/graphql/hive/federation-gateway-audit)

[📖 Read more about our methodology and why we created this audit](https://the-guild.dev/graphql/hive/federation-gateway-audit#manifesto)

<!-- gateways:start -->

|                                                                                  Gateway                                                                                   | Compatibility |  Test Cases  | Test Suites |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------: | :----------: | :---------: |
|                                                           [Hive Router](https://github.com/graphql-hive/router)                                                            |    100.00%    |    🟢 210    |    🟢 48    |
|                                                                  [Cosmo Router](https://wundergraph.com)                                                                   |    99.05%     | 🟢 208 ❌ 2  | 🟢 46 ❌ 2  |
|                                                         [Hive Gateway](https://the-guild.dev/graphql/hive/gateway)                                                         |    99.05%     | 🟢 208 ❌ 2  | 🟢 47 ❌ 1  |
|                                [Hive Gateway (Rust QP)](https://the-guild.dev/graphql/hive/docs/gateway/other-features/rust-query-planner)                                 |    97.62%     | 🟢 205 ❌ 5  | 🟢 46 ❌ 2  |
| [Apollo Router v3 (dev-v3.x, incremental planner)](https://github.com/apollographql/router/blob/dev-v3.x/docs/source/routing/query-planning/incremental-query-planner.mdx) |    97.14%     | 🟢 204 ❌ 6  | 🟢 45 ❌ 3  |
|                                                              [Apollo Router](https://www.apollographql.com/)                                                               |    95.24%     | 🟢 200 ❌ 10 | 🟢 43 ❌ 5  |
|                                                              [Apollo Gateway](https://www.apollographql.com/)                                                              |    94.76%     | 🟢 199 ❌ 11 | 🟢 42 ❌ 6  |
|                                                       [Apollo Router v3 (dev-v3.x)](https://www.apollographql.com/)                                                        |    94.76%     | 🟢 199 ❌ 11 | 🟢 42 ❌ 6  |
|                                                                  [Grafbase Gateway](https://grafbase.com)                                                                  |    88.57%     | 🟢 186 ❌ 24 | 🟢 40 ❌ 8  |
|                                                [Hot Chocolate Fusion](https://chillicream.com/docs/hotchocolate/v16/fusion)                                                |    86.67%     | 🟢 182 ❌ 28 | 🟢 43 ❌ 5  |

<!-- gateways:end -->

[See the full report](./REPORT.md)

## Apollo Federation Coverage

The tests are based on the Apollo Federation specification and cover the following directives:

- `@interfaceObject`
- `@key`
- `@external`
- `@provides`
- `@requires`
- `@extends`
- `@inaccessible`
- `@shareable`
- `@skip`
- `@include`
- `@composeDirective`
- `@override`

**Out of scope (limited by Enterprise license of Apollo Router):**

We are not able to test the following directives on Apollo Router due to the limitations of the Enterprise license:

- `@authenticated`
- `@policy`
- `@requiresScopes`
- `@override(label:)`

We plan to test these directives as soon as we have access to the Enterprise license.

---

## CLI

> TODO: we're working on a CLI to make it easier to run the tests, stay tuned!

---

## Instructions

First of all, you need to install and prepare the gateways. You can do this by running the following command:

```bash
make install
```

> [!IMPORTANT]
> `Node`, `npm` and `jq` are required to run the whole setup. Some gateways need
> extra toolchains: `rustup`/`cargo` to build Apollo Router v3 from source
> (`apollo-router-v3`, `apollo-router-v3-incremental`) and the .NET 10 SDK for
> Hot Chocolate Fusion (`hot-chocolate-fusion`). Gateways whose `install.sh`
> fails are skipped by `make install` and show up as failing in the report.

### Testing all gateways

You can run the tests for each gateway by running the following command:

```bash
make test-all
```

### Testing a specific gateway

You can run the tests for a specific gateway by running the following command:

```bash
make test-[name of the gateway]

make test-apollo-gateway
make test-apollo-router
make test-apollo-router-v3
make test-apollo-router-v3-incremental
make test-cosmo-router
make test-grafbase-gateway
make test-hive-gateway
make test-hive-gateway-router-runtime
make test-hive-router
make test-hot-chocolate-fusion
```

### Running a gateway for a single test suite

In case you want to run only a limited set of tests, you can do so by running the following command:

```bash
make test-suite-[name of the gateway] TEST_SUITE=[id of the test suite]
```

### Running a gateway for a specific supergraph

There's also the possibility to start a gateway for a selected supergraph, in case you want to run the queries yourself.

```bash
make run-[name of the gateway] TEST_SUITE=[id of the test suite]
```

## Contributing or adding a new gateway

[See the contributing guide](./.github/CONTRIBUTING.md)
