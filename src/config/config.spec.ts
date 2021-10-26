import test from 'ava';
import getConfig from './config';

test.beforeEach(() => {
  Object.assign(process.env, { MONGO_URI: 'mongodb://localhost/fake' });
});

test('applies the defaults', (t) => {
  t.deepEqual(getConfig(), {
    environment: 'local',
    server: { port: '3000' },
    mongo: { uri: 'mongodb://localhost/fake' },
    logger: { level: 'info' },
  });
});

test('configures the environment', (t) => {
  const runtimeEnv = 'dev';

  Object.assign(process.env, { RUNTIME_ENV: runtimeEnv });

  t.like(getConfig(), { environment: runtimeEnv }, 'environment is set as configured');
});

test('configures the server', (t) => {
  const configuredPort = '4000';
  Object.assign(process.env, { PORT: configuredPort });

  t.like(getConfig(), { server: { port: configuredPort } }, 'port is set as configured');
});

test('it configures our mongo', (t) => {
  const configuredUri = 'mongodb://localhost/db';
  Object.assign(process.env, { MONGO_URI: configuredUri });

  t.like(getConfig(), { mongo: { uri: configuredUri } }, 'uri is set as configured');
});

test('it configures our logger', (t) => {
  const configuredLevel = 'warn';
  Object.assign(process.env, { LOG_LEVEL: configuredLevel });

  t.like(getConfig(), { logger: { level: configuredLevel } }, 'level is set as configured');

  const unknownLevel = 'darn';
  Object.assign(process.env, { LOG_LEVEL: unknownLevel });

  t.throws(getConfig, undefined, 'throws when invalid');
});
