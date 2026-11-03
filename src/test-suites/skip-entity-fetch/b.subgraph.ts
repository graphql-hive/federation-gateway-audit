import {
  getDirectiveValues,
  GraphQLIncludeDirective,
  GraphQLResolveInfo,
  GraphQLSkipDirective,
  Kind,
  SelectionSetNode,
} from "graphql";
import { createSubgraph } from "../../subgraph.js";
import { product } from "./data.js";

function isIncluded(
  node: Parameters<typeof getDirectiveValues>[1],
  info: GraphQLResolveInfo,
) {
  const skip = getDirectiveValues(
    GraphQLSkipDirective,
    node,
    info.variableValues,
  );
  if (skip?.if === true) {
    return false;
  }

  const include = getDirectiveValues(
    GraphQLIncludeDirective,
    node,
    info.variableValues,
  );
  return include?.if !== false;
}

// Whether the selection set selects at least one field other than
// `__typename`, once `@skip` / `@include` are applied.
function selectsAnyField(
  selectionSet: SelectionSetNode | undefined,
  info: GraphQLResolveInfo,
): boolean {
  if (!selectionSet) {
    return false;
  }

  return selectionSet.selections.some((selection) => {
    if (!isIncluded(selection, info)) {
      return false;
    }

    switch (selection.kind) {
      case Kind.FIELD:
        return selection.name.value !== "__typename";
      case Kind.INLINE_FRAGMENT:
        return selectsAnyField(selection.selectionSet, info);
      case Kind.FRAGMENT_SPREAD:
        return selectsAnyField(
          info.fragments[selection.name.value]?.selectionSet,
          info,
        );
    }
  });
}

export default createSubgraph("b", {
  typeDefs: /* GraphQL */ `
    extend schema
      @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

    type Product @key(fields: "id") {
      id: ID!
      details: ProductDetails
      inventory: ProductInventory
    }

    type ProductDetails {
      color: String
      size: String
    }

    type ProductInventory {
      inStock: Boolean
      warehouse: String
    }
  `,
  resolvers: {
    Product: {
      // A request whose selections are all skipped is a fetch the gateway
      // should never have made. Fail it, so it shows up in the response.
      __resolveReference(
        key: { id: string },
        _context: unknown,
        info: GraphQLResolveInfo,
      ) {
        if (!selectsAnyField(info.fieldNodes[0]?.selectionSet, info)) {
          throw new Error(
            "Received an entity fetch where every field is skipped",
          );
        }

        return key.id === product.id ? product : null;
      },
    },
  },
});
