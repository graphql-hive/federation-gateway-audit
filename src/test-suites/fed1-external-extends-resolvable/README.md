# Fed1 External Extends Resolvable

## Overview
This test suite validates compatibility with Apollo Federation v1 syntax, specifically testing the combination of `@external` and `@extends` directives that were used in Federation v1 to extend types across subgraphs.

## Apollo Federation Concepts Tested
- **Federation v1 compatibility**: Support for legacy Federation v1 directive syntax
- **@extends directive**: Federation v1 method for extending types defined in other subgraphs
- **@external directive**: Marking fields as owned by other subgraphs (same in v1 and v2)
- **Entity resolution**: How v1-style type extensions work with entity resolution
- **Migration support**: Ensuring v1 schemas can work with modern gateways

## Test Scenario
The test involves a Product entity that is distributed across subgraphs using Federation v1 patterns:

1. **Base Product Definition**: One subgraph defines the core Product type
2. **Product Extension**: Another subgraph extends the Product type using `@extends`
3. **Field Dependencies**: Extended fields depend on `@external` fields from the base definition

## Test Case

### Federation v1 Type Extension Resolution
- Tests that a Product entity can be successfully resolved across multiple subgraphs
- Verifies that `@extends` directive correctly extends types from other subgraphs
- Validates that `@external` fields are properly used for entity resolution
- Ensures all fields (id, pid, price, upc, name) are correctly resolved from their respective subgraphs

## What's Being Tested

### Legacy Syntax Support
1. **@extends Directive**: The Federation v1 syntax for type extension still works
2. **@external Fields**: v1-style external field declarations are properly handled
3. **Entity Resolution**: v1 extension patterns work with modern entity resolution

### Migration Compatibility
1. **Schema Evolution**: v1 schemas can be gradually migrated to v2 without breaking
2. **Gateway Support**: Modern gateways support legacy Federation v1 syntax
3. **Interoperability**: v1 and v2 syntax can potentially coexist in the same federation

### Functional Equivalence
1. **Feature Parity**: v1 extension patterns provide the same functionality as v2
2. **Resolution Consistency**: Entity resolution works the same way regardless of syntax version
3. **Performance**: No performance degradation when using v1 syntax

## Why This Matters
Federation v1 compatibility is important for:
- **Migration Paths**: Organizations can upgrade gateways without rewriting schemas
- **Legacy Support**: Existing Federation v1 deployments continue to work
- **Gradual Adoption**: Teams can migrate to v2 syntax incrementally
- **Investment Protection**: Existing Federation v1 investments remain valuable

## Federation v1 vs v2 Differences
- **v1**: Uses `@extends` to extend types defined in other subgraphs
- **v2**: Uses `@key` directives and type redefinition to achieve the same result
- **v1**: Requires explicit `@extends` for any type extension
- **v2**: More flexible syntax with better composition capabilities

## Migration Considerations
When migrating from v1 to v2:
1. Replace `@extends` with `@key` directives on redefined types
2. Update import statements to use v2 directive URLs
3. Consider using v2-specific features like `@shareable` and `@override`
4. Test thoroughly to ensure functional equivalence

This test ensures that organizations using Federation v1 can confidently upgrade their gateway infrastructure while maintaining their existing schema patterns.