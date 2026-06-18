# Interface Object with Requires

## Overview
This test suite validates the `@interfaceObject` directive combined with the `@requires` directive in Apollo Federation, testing how interface objects can depend on fields from other subgraphs.

## Apollo Federation Concepts Tested
- **@interfaceObject directive**: Converting interfaces into objects that can be extended across subgraphs
- **@requires directive**: Fields that depend on other fields from different subgraphs  
- **@external directive**: Fields owned by other subgraphs
- **Interface vs concrete type resolution**: How the gateway handles both interface objects and concrete implementations
- **Inline fragments**: Accessing concrete type fields through interface queries

## Test Scenario
The test involves a `NodeWithName` interface that is distributed across two subgraphs:

1. **Subgraph A**:
   - Defines `NodeWithName` interface and `User` concrete type
   - Owns the `User` entity with `id`, `name`, and `age` fields
   - Provides `users` query returning concrete User types

2. **Subgraph B**:
   - Uses `@interfaceObject` to create an object version of `NodeWithName` interface
   - Marks `name` as `@external` (owned by subgraph A)
   - Defines `username` field with `@requires(fields: "name")`
   - Provides `anotherUsers` query returning interface objects

## Test Cases

### 1. Basic Interface Object Resolution with @requires
- Tests that interface objects can resolve fields that require external dependencies
- Verifies `username` field is correctly computed using the required `name` field

### 2. Standard Entity Resolution
- Compares interface object behavior with standard entity resolution
- Ensures both patterns work correctly and produce consistent results

### 3. Inline Fragment Resolution
- Tests that `... on User` fragments work with both interface objects and concrete types
- Verifies access to concrete type fields (`age`) through interface queries

### 4. Complex Field Selection
- Tests queries that select both interface fields and concrete type fields
- Verifies the gateway can handle mixed field selections correctly

## What's Being Tested
1. **Interface Object Extension**: `@interfaceObject` allows treating interfaces as extendable entities
2. **Cross-Subgraph Dependencies**: Fields in interface objects can depend on fields from other subgraphs
3. **Field Resolution Consistency**: Both interface objects and concrete types resolve fields consistently  
4. **Fragment Handling**: Inline fragments work correctly with interface objects
5. **Complex Selection Sets**: The gateway properly handles queries with mixed field types

This suite ensures that the advanced `@interfaceObject` directive works correctly with field dependencies, enabling powerful interface-based federation patterns.