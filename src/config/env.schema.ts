import { FromSchema } from 'json-schema-to-ts';

export const EnvSchema = {
  type: 'object',
  properties: {
    LOG_LEVEL: {
      type: 'string',
      enum: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
    },
    MONGO_URI: {
      type: 'string',
    },
    PORT: {
      type: 'string',
    },
    RUNTIME_ENV: {
      type: 'string',
      enum: ['local', 'test', 'dev', 'sta', 'pro'],
    },
  },
  required: ['MONGO_URI'],
  additionalProperties: false,
} as const;

export type Env = FromSchema<typeof EnvSchema>;
