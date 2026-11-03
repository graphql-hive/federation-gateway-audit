# Union Overfetching

Based on
[apollographql/federation#2759](https://github.com/apollographql/federation/issues/2759).

A union field (`ProductCard.components`) has members `ComponentA | ComponentB |
ComponentC`, each pointing at a `Product` entity. The operation selects a
different `Product` field in each member's inline fragment (`a`, `b` and `c`),
and those fields are resolved by another subgraph.

A correct gateway only requests `Product.a` for products reached through
`ComponentA`, `Product.b` for products reached through `ComponentB`, and so on.

A buggy planner merges all the fragments into one entity fetch
(`... on Product { a b c }`) for every product, no matter which union member it
came from. So it asks for fields the client never selected for that object,
including fields of a member that isn't in the response at all.

To make this overfetching visible, the `product` subgraph throws when a field is
resolved for a product of the wrong kind. The fields are non-nullable, so the
error nulls out the entity and shows up in the response.
