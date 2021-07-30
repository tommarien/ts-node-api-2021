import envSchema from 'env-schema';
import Schema from 'fluent-json-schema';

const schema = Schema.object()
  .prop('PORT', Schema.string())
  .prop('LOG_LEVEL', Schema.string().enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']))
  .prop('MONGO_URI', Schema.string());

interface Env {
  PORT?: string;
  LOG_LEVEL?: string;
  MONGO_URI?: string;
}

export interface Config {
  server: { port: string };
  mongo: { uri?: string };
  logger: { level: string };
}

const env = envSchema({
  dotenv: true,
  schema,
}) as Env;

const config: Config = {
  server: { port: env.PORT || '3000' },
  mongo: { uri: env.MONGO_URI },
  logger: { level: env.LOG_LEVEL || 'info' },
};

export default config;
