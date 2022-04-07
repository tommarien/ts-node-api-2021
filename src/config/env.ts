import { JSONSchemaType } from 'ajv';

const ALLOWED_LOGLEVELS = [
  'fatal',
  'error',
  'warn',
  'info',
  'debug',
  'trace',
  'silent',
] as const;
const ENVIRONMENTS = ['local', 'test', 'dev', 'sta', 'pro'] as const;

export interface Env {
  LOG_LEVEL?: typeof ALLOWED_LOGLEVELS[number];
  MONGO_URI: string;
  PORT?: string;
  RUNTIME_ENV?: typeof ENVIRONMENTS[number];
}

export const envSchema: JSONSchemaType<Env> = {
  type: 'object',
  properties: {
    LOG_LEVEL: {
      type: 'string',
      enum: ALLOWED_LOGLEVELS,
      nullable: true,
    },
    MONGO_URI: {
      type: 'string',
    },
    PORT: {
      type: 'string',
      nullable: true,
    },
    RUNTIME_ENV: {
      type: 'string',
      enum: ENVIRONMENTS,
      nullable: true,
    },
  },
  required: ['MONGO_URI'],
};
