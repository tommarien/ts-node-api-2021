import envSchema from 'env-schema';
import Schema from 'fluent-json-schema';

const schema = Schema.object()
  .prop('PORT', Schema.string().default('3000'))
  .prop(
    'LOG_LEVEL',
    Schema.string().enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  )
  .prop('MONGO_URI', Schema.string());

interface Env {
  PORT: string;
  LOG_LEVEL: string;
  MONGO_URI?: string;
}

const env = envSchema({
  dotenv: true,
  schema,
});

export default env as unknown as Env;
