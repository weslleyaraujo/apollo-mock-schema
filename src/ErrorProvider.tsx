import React, { useMemo } from "react";
import { ApolloLink } from "apollo-link";
import ApolloClient from "apollo-client";
import { ApolloProvider } from "@apollo/react-common";
import { useCache } from "./useCache";
import { useLinkError } from "./useLinkError";
import { createSchemaErrorLink } from "./createSchemaErrorLink";

interface Props {
  graphQLErrors?: { message: string }[];
  children: React.ReactNode;
}

function ErrorProvider({ graphQLErrors, children }: Props) {
  const cache = useCache();
  const linkError = useLinkError();
  const link = useMemo(() => createSchemaErrorLink({ graphQLErrors }), [
    graphQLErrors
  ]);

  const client = new ApolloClient({
    link: ApolloLink.from([linkError, link]),
    cache,
    defaultOptions: {
      query: {
        errorPolicy: "all",
        fetchPolicy: "no-cache"
      }
    }
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export { ErrorProvider };
