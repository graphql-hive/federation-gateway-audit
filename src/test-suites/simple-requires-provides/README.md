# Simple Requires Provides

## Overview
This is one of the most comprehensive test suites that validates the core Apollo Federation directives `@requires` and `@provides`. It demonstrates how these directives optimize federated queries by reducing round trips and enabling computed fields that depend on data from other subgraphs.

## Apollo Federation Concepts Tested
- **@requires directive**: Fields that depend on other fields from different subgraphs
- **@provides directive**: Fields that can be provided by one subgraph to avoid fetching from another
- **@external directive**: Fields owned by other subgraphs
- **@shareable directive**: Fields that can be resolved by multiple subgraphs
- **Entity resolution**: Complex multi-hop entity relationships
- **Query optimization**: How requires/provides reduce network round trips

## Test Scenario
This test suite models a typical e-commerce scenario with four subgraphs:

### 1. Accounts Subgraph
- Owns `User` entity with `id`, `name`, `username` fields
- Provides `me` query for user authentication
- `username` is marked as `@shareable`

### 2. Products Subgraph  
- Owns `Product` entity with `upc`, `name`, `price`, `weight` fields
- Provides `products` query
- Core product information

### 3. Reviews Subgraph
- Owns `Review` entity linking users and products
- Extends `User` with `reviews` field
- Extends `Product` with `reviews` field
- **Key feature**: Uses `@provides(fields: "username")` on `Review.author`
- This means when resolving a review's author, it provides the username field directly instead of requiring a fetch from the accounts subgraph

### 4. Inventory Subgraph
- Extends `Product` with inventory-related fields
- Marks `price` and `weight` as `@external`
- **Key features**: 
  - `shippingEstimate` uses `@requires(fields: "price weight")`
  - `shippingEstimateTag` uses `@requires(fields: "price weight")`
  - These computed fields need the price and weight from products subgraph

## Test Cases

### Basic Queries (Tests 1-3)
- Simple field access without cross-subgraph dependencies
- Basic entity resolution (user -> reviews)
- **@provides demonstration**: Review author username provided directly

### Product Queries (Tests 4-7)  
- Basic product field access
- **@requires demonstration**: `shippingEstimate` computed using required fields
- Verification that required fields and computed fields can be returned together

### Complex Scenarios (Tests 8-13)
- **Combined @provides and @requires**: Complex queries using both directives
- **Circular references**: Entities referencing each other (user -> reviews -> product -> reviews)
- **Entity chains**: Multiple entity resolutions in sequence
- **Multiple @requires fields**: Several computed fields with same dependencies

## Query Optimization Patterns

### Without @provides:
```
Query: reviews { author { username } }
1. Fetch reviews from reviews subgraph
2. Fetch user data from accounts subgraph for each author
Total: 1 + N requests
```

### With @provides:
```
Query: reviews { author { username } }
1. Fetch reviews with provided username from reviews subgraph  
Total: 1 request
```

### Without @requires:
```
Query: product { shippingEstimate }
❌ Cannot compute - price/weight not available
```

### With @requires:
```
Query: product { shippingEstimate }
1. Fetch product with price/weight from products subgraph
2. Compute shippingEstimate in inventory subgraph
Total: Efficient field resolution
```

## What's Being Tested
1. **Field Dependencies**: `@requires` correctly fetches dependent fields before computation
2. **Query Optimization**: `@provides` reduces unnecessary subgraph calls
3. **Complex Scenarios**: Both directives work in nested, multi-entity queries
4. **Performance**: Efficient resolution of complex federated queries
5. **Correctness**: All computed and provided fields return accurate results

This test suite is essential for validating that gateways can handle real-world federated architectures with complex data dependencies and optimization requirements.