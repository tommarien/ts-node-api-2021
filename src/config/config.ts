import envSchema from 'env-schema';
import Schema from 'fluent-json-schema';

const ALLOWED_LOGLEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const;
const ENVIRONMENTS = ['local', 'test', 'dev', 'sta', 'pro'] as const;

const schema = Schema.object()
  .prop('LOG_LEVEL', Schema.string().enum([...ALLOWED_LOGLEVELS]))
  .prop('MONGO_URI', Schema.string().required())
  .prop('PORT', Schema.string())
  .prop('RUNTIME_ENV', Schema.string().enum([...ENVIRONMENTS]));

interface Env {
  LOG_LEVEL?: typeof ALLOWED_LOGLEVELS[number];
  MONGO_URI: string;
  PORT?: string;
  RUNTIME_ENV?: typeof ENVIRONMENTS[number];
}

export interface Config {
  environment: typeof ENVIRONMENTS[number];
  server: { port: string };
  mongo: { uri: string };
  logger: { level: typeof ALLOWED_LOGLEVELS[number] };
}

export default function getConfig(): Config {
  const env = envSchema<Env>({
    dotenv: !process.env.TAP,
    schema,
  });

  const config: Config = {
    environment: env.RUNTIME_ENV || 'local',
    server: { port: env.PORT || '3000' },
    mongo: { uri: env.MONGO_URI },
    logger: { level: env.LOG_LEVEL || 'info' },
  };

  return config;
}
