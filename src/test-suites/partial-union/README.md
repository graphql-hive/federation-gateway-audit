# Partial Union

A `@shareable` type contains a union whose members differ across subgraphs (a
"partial union"). 

The primary subgraph declares the full union
(`Alpha | Beta | Gamma`) while the secondary subgraph declares only `Alpha`.

None of the union members define a `@key`, so members missing from a subgraph
can never be reached through entity resolution.

A correct gateway must keep every inline fragment in the operation and resolve
the field from the subgraph that actually knows the full union. 

A buggy planner may instead strip the inline fragments for `Beta` and `Gamma` — assuming they
can be fetched later via entity resolution — which makes those fields return
`null`.
