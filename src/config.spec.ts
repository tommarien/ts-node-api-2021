import { randomUUID } from 'crypto';
import tap from 'tap';

const getConfig = async () => {
  const { default: config } = await import(`./config.js?now=${randomUUID()}`);
  return config;
};

tap.test('it applies the defaults', async (t) => {
  t.plan(1);
  t.same(await getConfig(), {
    isProduction: false,
    server: { port: '3000' },
    mongo: { uri: undefined },
    logger: { level: 'info' },
  });
});

tap.test('isProduction', async (t) => {
  t.plan(2);

  Object.assign(process.env, { NODE_ENV: 'development' });
  t.hasStrict(await getConfig(), { isProduction: false }, 'is false when NODE_ENV is development');

  Object.assign(process.env, { NODE_ENV: 'production' });
  t.hasStrict(await getConfig(), { isProduction: true }, 'is true when NODE_ENV is production');
});

tap.test('server', async (t) => {
  t.plan(1);

  const configuredPort = '4000';
  Object.assign(process.env, { PORT: configuredPort });

  t.hasStrict(await getConfig(), { server: { port: configuredPort } }, 'port is set as configured');
});

tap.test('mongo', async (t) => {
  t.plan(1);

  const configuredUri = 'mongodb://localhost/db';
  Object.assign(process.env, { MONGO_URI: configuredUri });

  t.hasStrict(await getConfig(), { mongo: { uri: configuredUri } }, 'uri is set as configured');
});

tap.test('logger', async (t) => {
  t.plan(2);

  const configuredLevel = 'warn';
  Object.assign(process.env, { LOG_LEVEL: configuredLevel });

  t.hasStrict(await getConfig(), { logger: { level: configuredLevel } }, 'level is set as configured');

  const unknownLevel = 'darn';
  Object.assign(process.env, { LOG_LEVEL: unknownLevel });

  t.rejects(getConfig, 'throws when invalid');
});
