# Include Skip

## Overview
This test suite validates that the standard GraphQL `@include` and `@skip` directives work correctly in Apollo Federation, ensuring that conditional field inclusion and exclusion behave as expected in federated queries.

## Apollo Federation Concepts Tested
- **@include directive**: Conditionally including fields based on variable values
- **@skip directive**: Conditionally excluding fields based on variable values
- **Query variable handling**: How federated gateways process GraphQL variables
- **Conditional field resolution**: Ensuring resolvers are only called for included fields
- **Query optimization**: Skipping unnecessary field resolution in federated environments

## Test Scenario
The test involves a Product entity with various fields that can be conditionally included or excluded:

1. **Standard Fields**: Always present fields like `price`
2. **Conditional Fields**: Fields controlled by `@include` and `@skip` directives
3. **Variable Control**: Using GraphQL variables to control directive behavior

## Test Cases

### 1. @include Directive with False Condition
- Tests that fields with `@include(if: false)` are completely omitted from the response
- Verifies that the gateway doesn't call resolvers for excluded fields
- Ensures query optimization by avoiding unnecessary field resolution

### 2. @skip Directive with True Condition  
- Tests that fields with `@skip(if: true)` are completely omitted from the response
- Verifies that skipped fields don't appear in the final result
- Validates that the gateway respects skip conditions during query execution

### 3. @include Directive with True Condition
- Tests that fields with `@include(if: true)` are included in the response
- Verifies that included fields are properly resolved and return their values
- Ensures that conditional inclusion works correctly when the condition is met

### 4. @skip Directive with False Condition
- Tests that fields with `@skip(if: false)` are included in the response  
- Verifies that non-skipped fields are properly resolved and return their values
- Validates that skip directives only exclude fields when the condition is true

## What's Being Tested

### Directive Processing
1. **Condition Evaluation**: The gateway correctly evaluates boolean conditions for directives
2. **Field Filtering**: Fields are properly included or excluded based on directive conditions
3. **Variable Resolution**: GraphQL variables are correctly passed to and evaluated by directives

### Federation Integration
1. **Cross-Subgraph Directives**: `@include` and `@skip` work correctly across federated subgraphs
2. **Query Planning**: The gateway optimizes query plans by excluding skipped fields
3. **Resolver Optimization**: Resolvers are not called for fields that will be excluded

### Standard Compliance
1. **GraphQL Specification**: `@include` and `@skip` behave according to GraphQL standards
2. **Variable Handling**: Default values and variable passing work correctly
3. **Response Format**: Conditional fields are properly omitted from responses

## Why This Matters
Conditional field directives are important for:
- **Performance Optimization**: Avoiding unnecessary data fetching and computation
- **Dynamic UIs**: Frontend applications that conditionally render based on user state
- **API Efficiency**: Reducing payload size by excluding unneeded data
- **Bandwidth Optimization**: Especially important for mobile applications

## Implementation Notes
These directives should be processed during query planning, not during execution:
- **Query Planning**: The gateway should exclude skipped fields from subgraph queries
- **Network Optimization**: Subgraphs shouldn't be asked to resolve excluded fields
- **Response Shaping**: Final response should naturally omit conditional fields

This test ensures that federated gateways maintain the same conditional field behavior as monolithic GraphQL servers, preserving client expectations and optimization opportunities.