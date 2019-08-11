> This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

## Apollo Mock Schema

[Demo](https://codesandbox.io/s/bold-elion-qzcrh?previewwindow=tests&module=src/App.test.tsx)

This package is 100% inspired by [@stubailo](https://twitter.com/stubailo) post [A new approach to mocking GraphQL data](https://www.freecodecamp.org/news/a-new-approach-to-mocking-graphql-data-1ef49de3d491/)

## Motivation

Apollo provides out of the box a [`MockedProvider`](https://www.apollographql.com/docs/react/api/react-testing/#mockedprovider) component where you can individually mock any graphql operation.

This approach works extremely fine ✅ but it comes with a cost of boilerplate and as your project grows it can get out of hand the number of mocked queries/mutations etc.

This package takes a different approach, as mentioned in [Sashko's](https://twitter.com/stubailo) blog post:

- Mock your GraphqlQL data for your **whole** schema.
- Customize our mocks on a per-component basis.
- Mock loading and error state with just one line of code.

I have personally been using this approach in quite a large GraphQL project and it definitely helps to keep track of all your mocks in one place, not mentioning the amount of boilerplate that can be reduced by doing so.

## Installation

This package depends on the following peer dependencies:

- @apollo/react-common
- @apollo/react-components
- apollo-cache-inmemory
- apollo-client
- graphql
- react

Make sure to have those installed in your project. Then:

```bash
yarn add apollo-mock-schema
```

## Api

### `ApolloMockSchemaProvider`

That's the main component which will mainly wrap your application and mock operations

> Examples using [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro)

```tsx
import { ApolloMockSchemaProvider } from 'apollo-mock-schema';
import { render } from '@testing-library/react';
import { Resolvers } from '../generated-resolvers.ts';

const firstName = 'Lorem';
const lastName = 'Ipsum';

const resolvers: Resolvers = () => ({
  Query: {
    user: () => ({
      isAuthenticated: true,
      firstName,
      lastName,
    }),
  },
});

const { queryByText } = render(
  <ApolloMockSchemaProvider<typeof resolvers>
    introspection={require('./schema.json').data}
    resolvers={resolvers}
    overwrite={{
      Query: {
        user: () => ({
          isAuthenticated: false,
        }),
      },
    }}
  >
    <App />
  </ApolloMockSchemaProvider>
);

expect(queryByText(firstName)).toBeInTheDocument();
expect(queryByText(lastName)).toBeInTheDocument();
expect(queryByText('authenticated')).toBeInTheDocument();
```

#### Props

| Prop                | type                                          | Required | Description                                                                                                                                                                                                                                                                                                                          |
| ------------------- | --------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resolvers`         | `T extends (...args: any) => any`             | ✅       | A factory to retrieve your resolvers shape. That really depends on your app's schema and essentially it's going to be forward to [`addResolveFunctionsToSchema`](https://www.apollographql.com/docs/graphql-tools/resolvers/#addresolvefunctionstoschema-schema-resolvers-resolvervalidationoptions-inheritresolversfrominterfaces-) |
| `children`          | `React.ReactNode` / `React.ReactElement<any>` | ✅       | The application/component to be tested                                                                                                                                                                                                                                                                                               |
| `introspection`     | `Object`                                      | ✅       | Introspection json of your app schema. Generally, this is an auto-generated file by tools like [`apollo-tooling`](https://github.com/apollographql/apollo-tooling) or [`graphql-code-generator`](https://graphql-code-generator.com/)                                                                                                |
| `overwrite`         | `DeepPartial<ReturnType<typeof resolvers>>`   | ⛔️      | Same interface as the output of your `resolvers`. This is the input for overwriting any GraphQL data.                                                                                                                                                                                                                                |
| `graphqlErrors`     | `{ message: string }[]`                       | ⛔️      | A list of GraphQL error messages case you intentionally expect an error.                                                                                                                                                                                                                                                             |
| `createApolloCache` | `() => ApolloCache<any>`                      | ⛔️      | A factory that should return an [`apollo-cache`](https://www.apollographql.com/docs/react/advanced/caching/). Defaults to a simple `apollo-inmemory-cache`                                                                                                                                                                           |
| `error`             | `boolean`                                     | ⛔️      | Enable all GraphQL operations to fail.                                                                                                                                                                                                                                                                                               |
| `loading`           | `boolean`                                     | ⛔️      | Enable all GraphQL operations to respond with `loading`                                                                                                                                                                                                                                                                              |

### Testing a loading state

```tsx
import { ApolloMockSchemaProvider } from 'apollo-mock-schema';
import { render } from '@testing-library/react';
import { Resolvers } from '../generated-resolvers.ts';
import { resolvers } from '../mocked-resolvers.ts';

const { queryByText } = render(
  <ApolloMockSchemaProvider<typeof resolvers>
    introspection={require('./schema.json').data}
    resolvers={resolvers}
    loading
  >
    <App />
  </ApolloMockSchemaProvider>
);

expect(queryByText(/Loading user.../)).toBeInTheDocument();
```

### Testing an error state

```tsx
import { ApolloMockSchemaProvider } from 'apollo-mock-schema';
import { render } from '@testing-library/react';
import { Resolvers } from '../generated-resolvers.ts';
import { resolvers } from '../mocked-resolvers.ts';

const { queryByText } = render(
  <ApolloMockSchemaProvider<typeof resolvers>
    introspection={require('./schema.json').data}
    resolvers={resolvers}
    error
  >
    <App />
  </ApolloMockSchemaProvider>
);

expect(queryByText(/GraphQL error while loading user/)).toBeInTheDocument();
```

### `createSchemaClient`

Internally used on `ApolloMockSchema`. That's the factory that will return an apollo client with a custom [`Schema Link`](https://www.apollographql.com/docs/link/links/schema/)

```tsx
import { createSchemaClient } from 'apollo-mock-schema';

const client = createSchemaClient({
  introspection,
  cache,
  overwrite,
  resolvers,
});
```

| Parameter       | type                                        | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------- | ------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `resolvers`     | `T extends (...args: any) => any`           | `true`   | A factory to retrieve your resolvers shape. That really depends on your app's schema and essentially it's going to be forward to [`https://www.apollographql.com/docs/graphql-tools/resolvers/#addresolvefunctionstoschema-schema-resolvers-resolvervalidationoptions-inheritresolversfrominterfaces-`](https://www.apollographql.com/docs/graphql-tools/resolvers/#addresolvefunctionstoschema-schema-resolvers-resolvervalidationoptions-inheritresolversfrominterfaces-) |
| `introspection` | `Object`                                    | `true`   | Introspection json of your app schema. Generally this is an auto generated file by tools like [`apollo-tooling`](https://github.com/apollographql/apollo-tooling) or [`graphql-code-generator`](https://graphql-code-generator.com/)                                                                                                                                                                                                                                        |
| `overwrite`     | `DeepPartial<ReturnType<typeof resolvers>>` | `false`  | Same interface as the output of your `resolvers`. This is input for overwriting data.                                                                                                                                                                                                                                                                                                                                                                                       |
| `cache`         | `ApolloCache<any>`                          | `false`  | An [apollo-cache](https://www.apollographql.com/docs/react/advanced/caching/) instance                                                                                                                                                                                                                                                                                                                                                                                      |

### `createSchemaErrorLink`

Internally used on `ApolloMockSchema`. That's the factory that will return an apollo client that will fail with an error for all graphql operations.

```tsx
import { createSchemaErrorLink } from 'apollo-mock-schema';
import { ApolloLink } from 'apollo-link';
import ApolloClient from 'apollo-client';

const link = createSchemaErrorLink({ graphQLErrors });
const client = new ApolloClient({
  link: ApolloLink.from([link]),
  cache,
  defaultOptions: {
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'no-cache',
    },
  },
});
```

| Parameter       | type                    | Required | Description                                                              |
| --------------- | ----------------------- | -------- | ------------------------------------------------------------------------ |
| `graphqlErrors` | `{ message: string }[]` | `false`  | A list of GraphQL error messages case you intentionally expect an error. |

## Local Development

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for your convenience. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

<img src="https://user-images.githubusercontent.com/4060187/52168303-574d3a00-26f6-11e9-9f3b-71dbec9ebfcb.gif" width="600" />

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

<img src="https://user-images.githubusercontent.com/4060187/52168322-a98e5b00-26f6-11e9-8cf6-222d716b75ef.gif" width="600" />

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.
