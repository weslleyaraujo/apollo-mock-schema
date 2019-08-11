import { useContext, useMemo } from "react";
import { OptionsContext } from "./options-context";
import { buildClientSchema, IntrospectionQuery } from "graphql";

function useIntrospection() {
  const { introspection } = useContext(OptionsContext);
  if (!introspection) {
    throw new Error("[apollo-mock-schema] Introspection not found in context");
  }
  return useMemo(() => buildClientSchema(introspection as IntrospectionQuery), [
    introspection
  ]);
}

export { useIntrospection };
