import envSchema from 'env-schema';
import { Env, envSchema as schema } from './env';

export interface Config {
  environment: NonNullable<Env['RUNTIME_ENV']>;
  server: { port: string };
  mongo: { uri: string };
  logger: { level: NonNullable<Env['LOG_LEVEL']> };
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
