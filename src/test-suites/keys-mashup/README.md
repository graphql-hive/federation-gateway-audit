# Keys Mashup

## Overview
This test suite validates complex entity key relationships in Apollo Federation, testing scenarios where entities have multiple interconnected key fields and can be resolved through different paths across subgraphs.

## Apollo Federation Concepts Tested
- **Complex entity keys**: Entities with multiple potential key strategies
- **Cross-subgraph entity resolution**: Resolving entities that span multiple subgraphs
- **Entity relationship chains**: Entities that reference other entities through various key patterns
- **Multi-hop resolution**: Following entity relationships across multiple subgraphs

## Test Scenario
The test involves two entity types with complex interdependencies:

1. **Entity A**: Can be resolved using different key strategies
2. **Entity B**: References multiple Entity A instances through various key patterns

The subgraphs demonstrate:
- Different ways to identify and resolve the same entity type
- How entities can have fields contributed by multiple subgraphs
- Complex key matching strategies that work across subgraph boundaries

## Test Case

### Complex Entity Key Resolution
- Tests that Entity B can resolve its relationship to multiple Entity A instances
- Verifies that each Entity A instance gets fields from appropriate subgraphs:
  - `id` and `name` from one subgraph
  - `nameInB` field from another subgraph that extends Entity A
- Demonstrates that the gateway can handle complex entity resolution patterns

## What's Being Tested

### Advanced Key Strategies
1. **Multiple Key Definitions**: Entities can be defined with different key fields in different subgraphs
2. **Key Resolution Logic**: The gateway correctly chooses the appropriate key strategy for resolution
3. **Cross-Reference Handling**: Entities can reference each other through various key patterns

### Federation Complexity
1. **Multi-Subgraph Entities**: Single entities can have fields distributed across multiple subgraphs
2. **Relationship Resolution**: Complex object relationships work correctly across subgraph boundaries
3. **Performance Optimization**: The gateway efficiently resolves complex entity graphs

### Data Consistency
1. **Key Matching**: Different key strategies for the same entity produce consistent results
2. **Field Distribution**: Fields from different subgraphs are correctly merged for each entity
3. **Relationship Integrity**: Entity relationships maintain data integrity across resolution hops

## Why This Matters
Complex entity key patterns are important for:
- **Legacy System Integration**: Different systems may identify the same entities using different keys
- **Performance Optimization**: Multiple key strategies allow for optimized query paths
- **Flexible Architecture**: Teams can evolve their entity identification strategies independently
- **Real-World Complexity**: Production systems often have complex, interconnected entity relationships

This test ensures that federated gateways can handle sophisticated entity resolution scenarios that are common in large, distributed systems where multiple teams manage interconnected data.