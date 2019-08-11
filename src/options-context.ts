import React from "react";
import { ApolloCache } from "apollo-cache";

interface Context {
  createApolloCache?: () => ApolloCache<any>;
  introspection?: Object;
}

const OptionsContext = React.createContext<Context>({});

export { OptionsContext, Context };
