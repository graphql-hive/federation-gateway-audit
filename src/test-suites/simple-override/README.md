# Simple Override

## Overview
This test suite validates the basic functionality of the `@override` directive in Apollo Federation, which allows one subgraph to take ownership of a field that was previously defined in another subgraph.

## Apollo Federation Concepts Tested
- **@override directive**: Transferring field ownership between subgraphs
- **@shareable directive**: Fields that can be resolved by multiple subgraphs
- **Field resolution precedence**: How the gateway determines which subgraph resolves a field
- **Schema evolution**: Migrating field ownership between subgraphs

## Test Scenario
The test involves two subgraphs managing Post entities:

1. **Subgraph A**:
   - Originally owns the `createdAt` field on `Post` type
   - Marks `createdAt` as `@shareable`
   - Provides `feed` and `aFeed` queries

2. **Subgraph B**:
   - Uses `@override(from: "a")` to take ownership of `createdAt` field
   - Also marks `createdAt` as `@shareable`
   - Provides `feed` and `bFeed` queries

## Test Cases

### 1. Basic Override Functionality
- Tests that queries for `feed` get the `createdAt` field resolved by subgraph B
- Verifies that the `@override` directive successfully transfers field ownership
- Ensures that the gateway routes field resolution to the overriding subgraph

### 2. Override Consistency Across Query Sources
- Tests that the override behavior is consistent regardless of which query is used
- Verifies that both subgraph-specific queries (`aFeed`, `bFeed`) respect the override
- Ensures that field ownership changes apply globally, not just to specific queries

## What's Being Tested

### Field Ownership Migration
1. **Ownership Transfer**: The `@override` directive successfully transfers field responsibility
2. **Resolution Routing**: The gateway correctly routes field resolution to the overriding subgraph
3. **Consistency**: Field resolution behavior is consistent across all query entry points

### Schema Evolution Support
1. **Gradual Migration**: Teams can gradually migrate field ownership between subgraphs
2. **Backwards Compatibility**: Existing queries continue to work during field migration
3. **Deployment Safety**: Override changes can be deployed safely without breaking clients

### Gateway Behavior
1. **Directive Processing**: The gateway correctly interprets and applies `@override` directives
2. **Query Planning**: Override directives are properly considered during query planning
3. **Field Resolution**: The correct subgraph is chosen for field resolution

## Why This Matters
The `@override` directive is crucial for:
- **Schema Evolution**: Teams can migrate field ownership as their architecture evolves
- **Performance Optimization**: Moving field resolution closer to the data source
- **Team Boundaries**: Allowing teams to take ownership of fields relevant to their domain
- **Technical Debt**: Enabling gradual refactoring of federated schemas

This test ensures that the fundamental `@override` functionality works correctly, enabling teams to evolve their federated schemas safely and efficiently.