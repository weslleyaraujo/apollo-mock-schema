import React from 'react';
import { useCache } from './useCache';
import { useIntrospection } from './useIntrospection';
import { ApolloProvider } from '@apollo/react-common';
import { createSchemaClient, MockSchema } from './createSchemaClient';
import { UnknownResolver } from './UnknownResolver';

interface Props<T extends UnknownResolver> extends MockSchema<T> {
  children: React.ReactNode;
}

function SchemaProvider<T extends UnknownResolver>({
  children,
  resolvers,
  overwrite,
}: Props<T>) {
  const introspection = useIntrospection();
  const cache = useCache();
  const client = createSchemaClient({
    introspection,
    cache,
    overwrite,
    resolvers,
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export { SchemaProvider };
