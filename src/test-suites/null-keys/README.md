# Null Keys

## Overview
This test suite validates that Apollo Federation correctly handles null values in entity key fields and relationships, ensuring that the federated query execution doesn't break when encountering optional relationships or missing data.

## Apollo Federation Concepts Tested
- **Null value handling**: How the gateway processes null values in entity relationships
- **Optional relationships**: Entity references that may or may not exist
- **Graceful degradation**: Continuing query execution when some data is missing
- **Entity resolution robustness**: Maintaining query execution integrity with partial data

## Test Scenario
The test involves a book catalog system where:

1. **BookContainer**: Contains book information
2. **Book**: Has a UPC identifier and an optional author relationship
3. **Author**: May or may not exist for each book (some books have null authors)

The scenario tests that the gateway properly handles:
- Books with valid author relationships
- Books with null author relationships
- Mixed data sets containing both scenarios

## Test Case

### Null Author Relationship Handling
- Tests a query that requests book containers with book and author information
- Verifies that books with valid authors return complete data
- Ensures that books with null authors gracefully return null for the author field
- Validates that the presence of null values doesn't break the overall query execution

## What's Being Tested

### Null Value Propagation
1. **Null Safety**: The gateway correctly propagates null values through entity resolution
2. **Partial Results**: Queries can return partial results when some relationships are null
3. **Data Integrity**: Null values don't corrupt or prevent other valid data from being returned

### Query Execution Robustness
1. **Error Handling**: Null values in entity keys don't cause query failures
2. **Mixed Data Sets**: Queries correctly handle arrays containing both valid and null references
3. **Field Resolution**: Non-null fields continue to resolve correctly even when related fields are null

### Real-World Scenarios
1. **Optional Relationships**: Common pattern where entities may or may not have certain relationships
2. **Data Migration**: Scenarios where some entities haven't been fully populated yet
3. **Legacy Data**: Systems with incomplete or missing relationship data

## Why This Matters
Null value handling is crucial for:
- **Data Quality**: Real-world data often has missing or incomplete relationships
- **Gradual Migration**: Systems being migrated to federation may have partial data
- **Optional Features**: Not all entities require all relationships to be meaningful
- **User Experience**: Applications should gracefully handle missing data without breaking

This test ensures that federated gateways maintain robust query execution even when encountering incomplete or missing data, which is essential for production systems where data quality may vary and relationships are often optional.