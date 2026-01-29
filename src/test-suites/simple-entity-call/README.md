# Simple Entity Call

## Overview
This test suite validates the basic Apollo Federation capability of entity resolution across multiple subgraphs.

## Apollo Federation Concepts Tested
- **Entity Resolution**: Tests the fundamental ability to resolve entities across subgraphs
- **@key directive**: Uses different key fields (`id` and `email`) to identify the same entity
- **@external directive**: Tests marking fields as external when they're owned by another subgraph

## Test Scenario
The test involves a `User` entity that is distributed across two subgraphs:

1. **Email Subgraph**: 
   - Owns the `User` entity with `@key(fields: "id")`
   - Provides the main query entry point and the `email` field
   - Can resolve users by their `id`

2. **Nickname Subgraph**:
   - Extends the `User` entity with `@key(fields: "email")`
   - Marks `email` as `@external` since it's owned by the email subgraph
   - Provides the `nickname` field
   - Can resolve users by their `email`

## What's Being Tested
The test verifies that when querying for a user's `id` and `nickname`, the gateway:
1. Fetches the user from the email subgraph (getting `id` and `email`)
2. Uses the `email` to resolve the `nickname` from the nickname subgraph
3. Combines both pieces of data into a single response

This demonstrates the core federation principle of distributed data composition.