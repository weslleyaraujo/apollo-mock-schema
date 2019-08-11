import ApolloClient from "apollo-client";
import SchemaLink from "apollo-link-schema";
import merge from "lodash.merge";
import { createErrorLoggerLink } from "./createErrorLoggerLink";
import { addResolveFunctionsToSchema } from "graphql-tools";
import { ApolloLink } from "apollo-link";
import { DeepPartial } from "utility-types";
import { GraphQLSchema } from "graphql";
import { ApolloCache } from "apollo-cache";
import { UnknownResolver } from "./UnknownResolver";

export interface MockSchema<T extends UnknownResolver> {
  resolvers: T;
  overwrite?: DeepPartial<ReturnType<T>>;
}

function createSchemaLink<
  T extends UnknownResolver,
  K extends Object = Object
>({
  resolvers,
  introspection,
  overwrite,
  cache
}: {
  introspection: GraphQLSchema;
  cache: ApolloCache<K>;
} & MockSchema<T>): ApolloClient<K> {
  const linkError = createErrorLoggerLink();
  const schemaResolvers = overwrite
    ? merge({}, resolvers(), overwrite)
    : merge({}, resolvers());

  addResolveFunctionsToSchema({
    schema: introspection,
    resolvers: schemaResolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
      allowResolversNotInSchema: true,
      requireResolversForAllFields: false,
      requireResolversForArgs: false,
      requireResolversForNonScalar: false
    }
  });

  const link = new SchemaLink({ schema: introspection });

  return new ApolloClient({
    resolvers: schemaResolvers,
    link: ApolloLink.from([linkError, link]),
    cache,
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all"
      }
    }
  });
}

export { createSchemaLink };
