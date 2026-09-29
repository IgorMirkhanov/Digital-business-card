import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLFormattedError } from 'graphql';
import { join } from 'node:path';
import { EnvironmentVariables } from '../config/env.validation';
import { createGraphQLContext } from './graphql-context';

export const DEFAULT_SANDBOX_QUERY = `query BusinessCard {
  profile {
    name
    headline
    description
    links { kind label url }
    skills { name category }
    experience {
      company
      position
      period { label isCurrent durationMonths }
      achievements
    }
    projects {
      name
      repositoryUrl
      technologies { name }
    }
  }
}
`;

export function graphqlConfigFactory(
  config: ConfigService<EnvironmentVariables, true>,
): ApolloDriverConfig {
  const sandbox = config.get('GRAPHQL_SANDBOX', { infer: true });
  return {
    // Schema is generated from code; the file is committed for reviewers, in production it stays in memory.
    autoSchemaFile: process.env.NODE_ENV === 'production' ? true : join(process.cwd(), 'schema.gql'),
    sortSchema: true,
    playground: false,
    introspection: sandbox,
    plugins: sandbox
      ? [ApolloServerPluginLandingPageLocalDefault({ document: DEFAULT_SANDBOX_QUERY, embed: true })]
      : [],
    context: createGraphQLContext,
    includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production',
    formatError,
  };
}

const HTTP_STATUS_TO_GRAPHQL_CODE: Record<number, string> = {
  400: 'BAD_REQUEST',
  404: 'NOT_FOUND',
};

/** Translates Nest HTTP exceptions thrown by services into meaningful GraphQL error codes. */
function formatError(formatted: GraphQLFormattedError): GraphQLFormattedError {
  const status = (formatted.extensions?.originalError as { statusCode?: number } | undefined)?.statusCode;
  const code = status ? HTTP_STATUS_TO_GRAPHQL_CODE[status] : undefined;
  if (!code) {
    return formatted;
  }
  const { originalError: _originalError, ...extensions } = formatted.extensions ?? {};
  return { ...formatted, extensions: { ...extensions, code } };
}
