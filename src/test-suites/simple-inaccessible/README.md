# Simple Inaccessible

## Overview
This test suite validates the `@inaccessible` directive in Apollo Federation, which allows schema elements to be hidden from the public API while still being available for internal federation operations.

## Apollo Federation Concepts Tested
- **@inaccessible directive**: Hiding fields, types, and enum values from the public schema
- **Schema composition**: How inaccessible elements affect schema merging
- **Field resolution**: How inaccessible fields behave during query execution
- **Error handling**: Validation errors when accessing inaccessible elements
- **Enum value filtering**: Hiding specific enum values while keeping others accessible

## Test Scenario
The test involves a User entity with friend relationships:

1. **Age Subgraph**:
   - Defines User entity with basic fields
   - Provides a clean query interface without inaccessible elements

2. **Friends Subgraph**:
   - Extends User with friends field that has an inaccessible default argument
   - Defines FriendType enum with FAMILY value marked as @inaccessible
   - Contains User.type field that returns the inaccessible enum value

## Test Cases

### 1. Normal Operation with Inaccessible Elements Present
- Tests that regular queries work normally when the schema contains @inaccessible elements
- Verifies that inaccessible elements don't break standard query execution
- Ensures that federation still works correctly with hidden schema elements

### 2. Query from Subgraph with Inaccessible Elements
- Tests queries originating from a subgraph that contains @inaccessible elements
- Verifies that the presence of inaccessible elements in a subgraph doesn't affect query execution
- Demonstrates that inaccessible elements are implementation details

### 3. Error Handling for Inaccessible Arguments
- Tests that using inaccessible enum values in arguments results in validation errors
- Verifies that the gateway properly enforces inaccessible restrictions
- Ensures that clients cannot access hidden schema elements even if they know about them

### 4. Null Return for Inaccessible Values
- Tests that fields returning inaccessible enum values return null
- Verifies that inaccessible elements are filtered from responses
- Demonstrates how the gateway handles inaccessible data gracefully

## What's Being Tested

### Schema Hiding
1. **Element Filtering**: Inaccessible elements are properly hidden from the public schema
2. **Validation**: Attempts to use inaccessible elements result in validation errors
3. **Response Filtering**: Inaccessible values are filtered from query responses

### Federation Integration
1. **Internal Operations**: Inaccessible elements can still be used for internal federation logic
2. **Schema Composition**: Inaccessible elements don't interfere with schema merging
3. **Query Planning**: The gateway can still plan queries despite hidden elements

### Runtime Behavior
1. **Error Handling**: Proper validation errors for inaccessible element usage
2. **Null Handling**: Graceful handling of inaccessible values in responses
3. **Performance**: No performance penalty for having inaccessible elements

## Why This Matters
The `@inaccessible` directive is important for:
- **API Evolution**: Hiding deprecated or experimental fields from public APIs
- **Internal Fields**: Keeping federation-specific fields hidden from clients
- **Schema Cleanup**: Removing clutter from public schemas while maintaining functionality
- **Gradual Migration**: Hiding fields during migration periods without breaking federation

## Implementation Notes
Different gateways may handle @inaccessible differently:
- **Schema Level**: Remove inaccessible elements from the composed schema
- **Runtime Level**: Filter inaccessible elements during query execution
- **Validation Level**: Prevent queries from accessing inaccessible elements

This test ensures that gateways properly implement the @inaccessible directive and handle edge cases appropriately.