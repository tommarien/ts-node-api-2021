import envSchema from 'env-schema';
import Schema from 'fluent-json-schema';

const schema = Schema.object()
  .prop('LOG_LEVEL', Schema.string().enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']))
  .prop('MONGO_URI', Schema.string().required())
  .prop('NODE_ENV', Schema.string())
  .prop('PORT', Schema.string());

interface Env {
  PORT?: string;
  LOG_LEVEL?: string;
  MONGO_URI: string;
  NODE_ENV?: string;
}

export interface Config {
  isProduction: boolean;
  server: { port: string };
  mongo: { uri: string };
  logger: { level: string };
}

export default function getConfig(): Config {
  const env = envSchema<Env>({
    dotenv: !process.env.TAP,
    schema,
  });

  const config: Config = {
    isProduction: env.NODE_ENV === 'production',
    server: { port: env.PORT || '3000' },
    mongo: { uri: env.MONGO_URI },
    logger: { level: env.LOG_LEVEL || 'info' },
  };

  return config;
}
