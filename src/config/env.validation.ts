import * as Joi from 'joi';

export interface EnvironmentVariables {
  DATABASE_URL: string;
  PORT: number;
  GRAPHQL_SANDBOX: boolean;
  DEFAULT_PROFILE_SLUG: string;
}

export const envValidationSchema = Joi.object<EnvironmentVariables>({
  DATABASE_URL: Joi.string().uri({ scheme: ['postgres', 'postgresql'] }).required(),
  PORT: Joi.number().port().default(3000),
  GRAPHQL_SANDBOX: Joi.boolean().default(true),
  DEFAULT_PROFILE_SLUG: Joi.string().default('igor-mirkhanov'),
});
