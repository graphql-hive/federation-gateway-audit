# Unavailable Override

## Overview
This test suite validates how Apollo Federation handles the `@override` directive when it references a non-existent subgraph, testing the gateway's resilience and error handling capabilities.

## Apollo Federation Concepts Tested
- **@override directive error handling**: Behavior when override source doesn't exist
- **Schema validation**: How gateways handle invalid directive references
- **Fallback behavior**: What happens when override cannot be applied
- **Gateway resilience**: Continuing operation despite schema configuration errors

## Test Scenario
The test involves a scenario where subgraph configuration contains an error:

1. **Subgraph A**:
   - Defines the `Post` type with `createdAt` field
   - Marks `createdAt` as `@shareable`
   - Provides query functionality

2. **Subgraph B**:
   - Attempts to override `createdAt` with `@override(from: "non-existing")`
   - References a subgraph that doesn't exist in the federation
   - Tests how the gateway handles this invalid configuration

## Test Cases

### 1. Invalid Override Reference Handling
- Tests that queries still work when `@override` references a non-existent subgraph
- Verifies that the gateway doesn't crash or fail due to invalid override configuration
- Ensures that field resolution falls back to available implementations

### 2. Consistent Behavior Across Queries
- Tests that the invalid override doesn't affect different query entry points
- Verifies that both subgraph-specific queries continue to work normally
- Ensures that the error handling is consistent across the entire schema

## What's Being Tested

### Error Resilience
1. **Invalid References**: How the gateway handles `@override` references to non-existent subgraphs
2. **Graceful Degradation**: Continuing normal operation despite configuration errors
3. **Fallback Logic**: Using available field implementations when override fails

### Schema Validation
1. **Configuration Validation**: Whether invalid `@override` directives are detected
2. **Runtime Behavior**: How the gateway behaves with invalid directive configurations
3. **Error Recovery**: Whether the system can recover from schema configuration errors

### Operational Stability
1. **Service Continuity**: Ensuring services remain operational despite configuration errors
2. **Query Execution**: Normal query processing continues with invalid overrides present
3. **System Robustness**: The federation remains stable with problematic schema configurations

## Why This Matters
Testing invalid override scenarios is important for:
- **Production Resilience**: Real deployments may have configuration errors
- **Deployment Safety**: Understanding what happens when deployments contain mistakes
- **Error Recovery**: Ensuring systems can continue operating during configuration issues
- **Developer Experience**: Providing clear behavior when schema configuration is incorrect

## Expected Behaviors
Different gateways might handle this scenario differently:
- **Strict Validation**: Reject the schema entirely during composition
- **Warning Mode**: Accept the schema but log warnings about invalid references
- **Ignore Mode**: Ignore the invalid override and use available field implementations
- **Error Mode**: Fail queries that encounter invalid override directives

This test helps identify how different gateway implementations handle edge cases and configuration errors, which is crucial for understanding their production behavior and reliability characteristics.