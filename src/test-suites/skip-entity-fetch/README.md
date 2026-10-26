# Skip Entity Fetch

`@skip` / `@include` on an object field whose subfields are resolved by
another subgraph.

Subgraph `a` resolves `Query.product`, `Product.id` and `Product.name`.
Subgraph `b` contributes the object fields `Product.details` and
`Product.inventory`.

When every field the gateway needs from `b` is skipped, there's nothing left
for `b` to resolve, and a correct gateway doesn't call it.

A buggy gateway plans the entity fetch to `b` statically and forwards the
directives to the subgraph:

```graphql
query ($representations: [_Any!]!, $skipDetails: Boolean!) {
  _entities(representations: $representations) {
    ... on Product {
      details @skip(if: $skipDetails) {
        color
        size
      }
    }
  }
}
```

With `skipDetails: true`, `b` returns empty objects (`{ "_entities": [{}] }`),
which is a round trip for nothing.

To make this observable, `b` fails an entity fetch whose selections are all
skipped once `@skip` / `@include` are applied.
