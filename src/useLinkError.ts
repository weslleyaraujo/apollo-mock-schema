import { useMemo } from "react";
import { createErrorLoggerLink } from "./createErrorLoggerLink";

function useLinkError() {
  return useMemo(createErrorLoggerLink, []);
}

export { useLinkError };
