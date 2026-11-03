import type { GraphQLResolveInfo } from "graphql";

/**
 * Reports the `@access(scope:)` value a subgraph effectively received for the
 * resolved field, so a test can check what the gateway forwarded:
 *
 * - the scope when `@access` arrived with an argument (inline enum value or a
 *   variable),
 * - the directive definition's default when `@access` arrived without an
 *   argument (so a gateway may forward a bare `@access` or materialize the
 *   default, both are correct),
 * - `NO_SCOPE` when there is neither an argument nor a default,
 * - `NO_DIRECTIVE` when the gateway did not forward the directive at all.
 */
export function effectiveAccessScope(info: GraphQLResolveInfo): string {
  const directive = info.fieldNodes[0]?.directives?.find(
    (d) => d.name.value === "access",
  );

  if (!directive) {
    return "NO_DIRECTIVE";
  }

  const scope = directive.arguments?.find((a) => a.name.value === "scope");

  if (scope) {
    switch (scope.value.kind) {
      case "EnumValue":
      case "StringValue":
        return scope.value.value;
      case "Variable":
        return String(info.variableValues[scope.value.name.value]);
      default:
        return `UNEXPECTED_${scope.value.kind}`;
    }
  }

  const defaultValue = info.schema
    .getDirective("access")
    ?.args.find((a) => a.name === "scope")?.defaultValue;

  return defaultValue === undefined ? "NO_SCOPE" : String(defaultValue);
}
