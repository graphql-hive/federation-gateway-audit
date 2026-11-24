# Executable directive forwarding

Both subgraphs define the same custom executable directive:

```graphql
directive @access(scope: Scope! = PUBLIC) on FIELD
```

Apollo composition merges executable directives that every subgraph defines
(intersecting their locations), so the supergraph exposes `@access` with its
default and clients can use it in operations.

A gateway has to forward the directive, together with its argument, to every
subgraph it sends the annotated field to:

- `@access(scope: PRIVATE)` must arrive as `PRIVATE`,
- `@access(scope: $scope)` must arrive with the variable's value,
- a bare `@access` may be forwarded as-is or materialized as
  `@access(scope: PUBLIC)`; the subgraph sees `PUBLIC` either way,
- fields without the directive must not receive one.

Each resolver returns the scope it effectively received
(`a:PRIVATE`, `a:PUBLIC`, `a:NO_SCOPE`, `a:NO_DIRECTIVE`, …), so dropping or
rewriting the directive fails the test.

Note that a default value defined in only some subgraphs is _not_ kept by
composition (`INCONSISTENT_DEFAULT_VALUE_PRESENCE`): the composed argument is
then required and a bare `@access` is invalid against the supergraph. This suite
therefore defines the same default in both subgraphs.
