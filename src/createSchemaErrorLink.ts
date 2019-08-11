import { ApolloLink, Observable } from 'apollo-link';

function createSchemaErrorLink({
  graphQLErrors,
}: {
  graphQLErrors?: { message: string }[];
} = {}) {
  return new ApolloLink(() => {
    const error = [...(graphQLErrors || [])]
      .map(error => error.message)
      .join('\n');

    return new Observable(() => {
      throw new Error(error || '[apollo-mock-schema] default error message');
    });
  });
}

export { createSchemaErrorLink };
