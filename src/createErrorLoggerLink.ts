import { onError } from "apollo-link-error";

function createErrorLoggerLink() {
  return onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(args =>
        console.debug(
          `[GraphQL error]: Operation ${
            operation.operationName
          } failed ${JSON.stringify(args, null, 2)} `
        )
      );
    }

    if (networkError) {
      console.debug(`[Network error]: ${networkError} ${operation}`);
    }
  });
}
export { createErrorLoggerLink };
