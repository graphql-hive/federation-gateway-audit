# Typename

## Overview
This test suite validates that the `__typename` introspection field works correctly across different GraphQL type constructs in a federated environment, including unions, interfaces, and regular entity types.

## Apollo Federation Concepts Tested
- **`__typename` introspection**: The built-in field that returns the concrete type name
- **Union type resolution**: How `__typename` identifies concrete types in unions
- **Interface type resolution**: How `__typename` works with interface implementations
- **Entity type resolution**: How `__typename` behaves with federated entities
- **Inline fragments**: Using `__typename` within type-specific fragments
- **Field aliases**: Using aliases for `__typename` field

## Test Scenario
The test involves several types that demonstrate different aspects of type resolution:

1. **Union Type**: A union that can return different concrete types (Oven, Toaster)
2. **Interface Type**: An interface with concrete implementations  
3. **Entity Types**: Regular federated entities (Admin users)

## Test Cases

### 1. Union Type `__typename` Resolution
- Tests that `__typename` correctly identifies the concrete type returned by a union field
- Verifies both direct `__typename` access and aliased versions
- Demonstrates that the gateway properly resolves union member types

### 2. Interface Type `__typename` Resolution  
- Tests that `__typename` returns the concrete implementing type, not the interface name
- Validates multiple aliases for the same `__typename` field
- Ensures interface type resolution works in federated scenarios

### 3. Inline Fragments with `__typename`
- Tests `__typename` behavior when used within inline fragments
- Verifies that fragment-based queries correctly resolve type information
- Demonstrates conditional field selection based on concrete types

### 4. Entity Type `__typename` Resolution
- Tests `__typename` with standard federated entities
- Compares behavior between simple entity queries and `__typename` queries
- Validates that entity types return correct type names

## What's Being Tested

### Type System Correctness
1. **Union Resolution**: `__typename` accurately identifies which union member is returned
2. **Interface Resolution**: `__typename` returns concrete type names, not interface names
3. **Entity Resolution**: Regular federated entities maintain correct type information

### Federation-Specific Behavior
1. **Cross-Subgraph Types**: `__typename` works correctly for types distributed across subgraphs
2. **Gateway Type Merging**: The gateway properly maintains type information during schema composition
3. **Query Planning**: `__typename` doesn't interfere with efficient query planning

### GraphQL Specification Compliance
1. **Field Aliases**: `__typename` can be aliased like any other field
2. **Fragment Compatibility**: `__typename` works within inline fragments
3. **Introspection Standards**: Follows GraphQL introspection specifications

## Why This Matters
The `__typename` field is crucial for:
- **Client-side caching**: Many GraphQL clients use `__typename` for cache normalization
- **Conditional rendering**: Frontend applications often render different components based on type
- **Type guards**: Runtime type checking in strongly-typed applications
- **Debugging**: Understanding what types are actually returned by queries

This test suite ensures that federated schemas maintain the same `__typename` behavior as monolithic schemas, preserving compatibility with existing GraphQL tooling and client applications.