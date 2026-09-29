import { LoaderRegistry } from './loaders/loader-registry';

export interface GraphQLContext {
  loaders: LoaderRegistry;
}

export function createGraphQLContext(): GraphQLContext {
  return { loaders: new LoaderRegistry() };
}
