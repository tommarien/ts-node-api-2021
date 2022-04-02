import Schema from 'fluent-json-schema';

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

export const envSchema = Schema.object()
  .prop('LOG_LEVEL', Schema.string().enum([...ALLOWED_LOGLEVELS]))
  .prop('MONGO_URI', Schema.string().required())
  .prop('PORT', Schema.string())
  .prop('RUNTIME_ENV', Schema.string().enum([...ENVIRONMENTS]));

export interface Env {
  LOG_LEVEL?: typeof ALLOWED_LOGLEVELS[number];
  MONGO_URI: string;
  PORT?: string;
  RUNTIME_ENV?: typeof ENVIRONMENTS[number];
}
