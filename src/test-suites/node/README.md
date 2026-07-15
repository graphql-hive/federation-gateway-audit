# Node

## Overview
This test suite validates the Node interface pattern in Apollo Federation, which is a common GraphQL pattern for global object identification, often used in Relay-style architectures.

## Apollo Federation Concepts Tested
- **Interface resolution**: How federated schemas handle interface types
- **Inline fragments**: Using type-specific field selection with `... on Type`
- **__typename field**: Introspection field for type identification
- **Global object identification**: The Node pattern for uniquely identifying objects across the graph

## Test Scenario
The test implements the Node interface pattern where:

1. **Node Interface**: A global interface that can be implemented by any type that has a unique `id`
2. **Product Implementation**: The Product type implements the Node interface
3. **Global Access**: Objects can be accessed globally through the Node interface

## Test Case

### Node Interface Resolution with Inline Fragments
- Tests that a query for a Node interface correctly resolves to the concrete Product type
- Verifies that inline fragments (`... on Product`) work correctly with federated interfaces
- Validates that all requested fields (id, name, __typename, price) are properly resolved
- Ensures the __typename field correctly identifies the concrete type

## What's Being Tested

### Interface Federation
1. **Interface Distribution**: Interfaces can be properly federated across subgraphs
2. **Type Resolution**: The gateway correctly resolves interface queries to concrete types
3. **Fragment Execution**: Inline fragments execute correctly on federated types

### Node Pattern Support
1. **Global Identification**: Objects can be accessed through a global Node interface
2. **Type Safety**: The interface pattern maintains type safety in federated environments
3. **Relay Compatibility**: The pattern supports Relay-style client requirements

## Why This Matters
The Node interface pattern is crucial for:
- **Global Object Identification**: Clients can access any object by its global ID
- **Caching**: Client-side caches can efficiently normalize data using global IDs
- **Refetching**: Objects can be refetched individually using their global identifiers
- **Relay Integration**: Essential for applications using Relay or similar frameworks

This test ensures that federated schemas maintain compatibility with the Node pattern, enabling advanced client-side features and maintaining consistency with GraphQL best practices.