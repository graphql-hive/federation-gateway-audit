# Mutations

## Overview
This test suite validates Apollo Federation's support for mutations across multiple subgraphs, including mutation ordering, shared mutations, and entity resolution within mutation responses.

## Apollo Federation Concepts Tested
- **Cross-subgraph mutations**: Mutations that affect data in one subgraph and resolve fields from others
- **@requires directive**: Fields that depend on other fields from different subgraphs
- **@shareable directive**: Mutations that can be defined in multiple subgraphs
- **@external directive**: Fields owned by other subgraphs
- **Mutation ordering**: Sequential execution of mutations to maintain consistency
- **Entity resolution in mutations**: Resolving entity fields after mutation operations

## Test Scenarios

### 1. Product Creation with Cross-Subgraph Resolution
- **Subgraph A**: Defines `addProduct` mutation, owns `Product` entity with `name` and `price`
- **Subgraph B**: Extends `Product` with computed fields (`isExpensive`, `isAvailable`)
- **Test**: Verifies that after creating a product, all fields are resolved correctly

### 2. Entity Resolution for Existing Data
- Tests that entity resolution works for querying existing products
- Validates `@requires(fields: "price")` for computing `isExpensive` field

### 3. Sequential Mutation Execution
- **Subgraphs A, B, C**: Each provides different mathematical operations
- **Test**: Verifies mutations execute in sequence: add(5) → multiply(2) → add(2) → delete()
- Demonstrates that mutations maintain state consistency across requests

### 4. Shared Mutations (@shareable)
- **Subgraphs A & B**: Both define `addCategory` mutation with `@shareable`
- **Test**: Verifies that the gateway can correctly route shared mutations

## What's Being Tested
1. **Mutation Response Entity Resolution**: After a mutation, the gateway can resolve entity fields from multiple subgraphs
2. **Field Dependencies**: Fields marked with `@requires` are properly resolved with their dependencies
3. **Mutation Ordering**: Multiple mutations in a single request execute in the specified order
4. **Shared Mutation Routing**: Mutations marked as `@shareable` can be handled by multiple subgraphs
5. **State Management**: Mutations properly maintain and modify shared state across subgraphs

This suite ensures that complex mutation scenarios work correctly in a federated environment.