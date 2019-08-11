import React, { useMemo } from "react";
import { ApolloLink, Observable } from "apollo-link";
import ApolloClient from "apollo-client";
import { ApolloProvider } from "@apollo/react-common";
import { useCache } from "./useCache";

interface Props {
  children: React.ReactNode;
}

function LoadingProvider({ children }: Props) {
  const cache = useCache();
  const link = useMemo(
    () => new ApolloLink(() => new Observable(() => {})),
    []
  );
  const client = useMemo(
    () =>
      new ApolloClient({
        link,
        cache,
        defaultOptions: {
          query: {
            fetchPolicy: "no-cache"
          }
        }
      }),
    []
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export { LoadingProvider };
