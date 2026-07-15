# Fed2 External Extends

## Overview  
This test suite validates Apollo Federation v2 syntax and patterns, specifically testing the modern approach to type extension and external field handling that replaced Federation v1's `@extends` directive.

## Apollo Federation Concepts Tested
- **Federation v2 syntax**: Modern approach to type extension using `@key` directives
- **@external directive**: v2 usage of external fields (same concept as v1 but improved syntax)
- **@provides directive**: v2 optimization for providing external fields
- **Entity redefinition**: v2 pattern of redefining types instead of extending them
- **Type composition**: How v2 composes types across subgraphs

## Test Scenario
The test demonstrates Federation v2 patterns for user entity management:

1. **User Entity Distribution**: User type is defined across multiple subgraphs using v2 patterns
2. **External Field Handling**: Fields like `rid` are marked as external and properly resolved
3. **Provides Optimization**: One subgraph uses `@provides` to optimize field resolution
4. **Modern Syntax**: Uses v2 directive imports and patterns throughout

## Test Cases

### 1. Multi-Query Entity Resolution
- Tests multiple user queries in a single request
- Verifies that different entry points (randomUser, userById) work correctly
- Validates that entity resolution works with v2 `@key` patterns

### 2. External Field Resolution
- Tests that `@external` fields can be properly resolved in v2
- Verifies that `rid` field (marked as external) is correctly fetched
- Ensures v2 external field patterns work efficiently

### 3. Combined Field Resolution
- Tests resolving both local and external fields together
- Verifies that v2 entity composition works for complex field sets
- Ensures optimal query planning for mixed field types

### 4. Provides Directive Optimization
- Tests the `@provides` directive functionality in v2
- Verifies that provided fields reduce necessary subgraph calls
- Validates that v2 provides patterns work correctly

## What's Being Tested

### Federation v2 Features
1. **Modern Syntax**: v2 directive syntax and import patterns
2. **Type Redefinition**: v2 approach to extending types without `@extends`
3. **Improved Composition**: Better type composition capabilities in v2

### Performance Optimizations
1. **@provides Usage**: Reducing round trips through field provision
2. **Query Planning**: Efficient query planning with v2 patterns
3. **Entity Resolution**: Optimized entity resolution strategies

### Syntax Evolution
1. **v1 to v2 Migration**: How v2 improves upon v1 patterns
2. **Directive Improvements**: Enhanced directive capabilities in v2
3. **Schema Composition**: Better schema merging in v2

## Why This Matters
Federation v2 is important because it:
- **Improved Developer Experience**: Cleaner, more intuitive syntax
- **Better Performance**: More optimization opportunities
- **Enhanced Features**: New directives like `@shareable`, `@override`, `@inaccessible`
- **Future-Proofing**: Foundation for future federation enhancements

## Federation v2 Advantages
Compared to v1, Federation v2 offers:
- **No @extends Required**: Types can be redefined directly with `@key`
- **Better Composition**: More flexible type composition patterns
- **New Directives**: Additional directives for advanced use cases
- **Improved Validation**: Better schema validation and error reporting
- **Performance**: Better query planning and execution

## Migration Considerations
When migrating from v1 to v2:
1. **Update Imports**: Change to v2 directive URLs
2. **Replace @extends**: Use `@key` on redefined types instead
3. **New Features**: Consider using new v2-specific directives
4. **Testing**: Ensure functional equivalence after migration

This test validates that modern federation gateways properly support Federation v2 syntax and can efficiently execute v2-style federated schemas.