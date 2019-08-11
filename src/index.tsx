import React from 'react';
import { OptionsContext, Context } from './options-context';
import { ErrorProvider } from './ErrorProvider';
import { LoadingProvider } from './LoadingProvider';
import { SchemaProvider } from './SchemaProvider';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createSchemaClient, MockSchema } from './createSchemaClient';
import { createSchemaErrorLink } from './createSchemaErrorLink';
import { UnknownResolver } from './UnknownResolver';

export interface Props<T extends UnknownResolver> extends MockSchema<T> {
  introspection: Object;
  children: React.ReactNode | React.ReactElement<any>;
  graphQLErrors?: React.ComponentProps<typeof ErrorProvider>['graphQLErrors'];
  createApolloCache?: Context['createApolloCache'];
  error?: boolean;
  loading?: boolean;
}

interface DefaultProps<T extends UnknownResolver>
  extends Required<Pick<Props<T>, 'createApolloCache'>> {}

const defaultProps: DefaultProps<UnknownResolver> = {
  createApolloCache: () => new InMemoryCache(),
};

function ApolloMockSchemaProvider<T extends UnknownResolver>({
  children,
  resolvers,
  overwrite,
  introspection,
  createApolloCache,
  loading,
  error,
  graphQLErrors,
}: Props<T> & DefaultProps<T>) {
  const value: Context = {
    createApolloCache,
    introspection,
  };

  if (error || (graphQLErrors && graphQLErrors.length)) {
    return (
      <OptionsContext.Provider value={value}>
        <ErrorProvider graphQLErrors={graphQLErrors}>{children}</ErrorProvider>
      </OptionsContext.Provider>
    );
  }

  if (loading) {
    return (
      <OptionsContext.Provider value={value}>
        <LoadingProvider>{children}</LoadingProvider>
      </OptionsContext.Provider>
    );
  }

  return (
    <OptionsContext.Provider value={value}>
      <SchemaProvider<T> resolvers={resolvers} overwrite={overwrite}>
        {children}
      </SchemaProvider>
    </OptionsContext.Provider>
  );
}

ApolloMockSchemaProvider.defaultProps = defaultProps;

export { ApolloMockSchemaProvider, createSchemaClient, createSchemaErrorLink };
