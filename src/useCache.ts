import { useContext, useMemo } from "react";
import { OptionsContext } from "./options-context";

function useCache() {
  const { createApolloCache } = useContext(OptionsContext);
  if (!createApolloCache) {
    throw new Error(
      "[apollo-mock-schema] Can't find createApolloCache on context."
    );
  }
  return useMemo(() => createApolloCache(), []);
}

export { useCache };
