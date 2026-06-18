# Partial Union Complex

A partial union appears below shareable fields, including a shareable field in the middle of the query path and an entity hop to another subgraph.

The gateway must keep union member fragments based on the subgraphs that can still resolve the current path, not based on a global intersection of all union members.

If an entity-representable shareable path can still be resolved in multiple subgraphs, only members common to those candidate subgraphs are guaranteed safe. If a field forces an entity hop before the union, the target subgraph's members should be used.
