import { test, beforeEach } from 'tap';
import getConfig from './config';

beforeEach(() => {
  Object.assign(process.env, { MONGO_URI: 'mongodb://localhost/fake' });
});

test('it applies the defaults', (t) => {
  t.same(getConfig(), {
    environment: 'local',
    server: { port: '3000' },
    mongo: { uri: 'mongodb://localhost/fake' },
    logger: { level: 'info' },
  });

  t.end();
});

test('environment', (t) => {
  const runtimeEnv = 'dev';

  Object.assign(process.env, { RUNTIME_ENV: runtimeEnv });

  t.hasStrict(getConfig(), { environment: runtimeEnv }, 'environment is set as configured');

  t.end();
});

test('server', (t) => {
  const configuredPort = '4000';
  Object.assign(process.env, { PORT: configuredPort });

  t.hasStrict(getConfig(), { server: { port: configuredPort } }, 'port is set as configured');

  t.end();
});

test('mongo', (t) => {
  const configuredUri = 'mongodb://localhost/db';
  Object.assign(process.env, { MONGO_URI: configuredUri });

  t.hasStrict(getConfig(), { mongo: { uri: configuredUri } }, 'uri is set as configured');

  t.end();
});

test('logger', (t) => {
  const configuredLevel = 'warn';
  Object.assign(process.env, { LOG_LEVEL: configuredLevel });

  t.hasStrict(getConfig(), { logger: { level: configuredLevel } }, 'level is set as configured');

  const unknownLevel = 'darn';
  Object.assign(process.env, { LOG_LEVEL: unknownLevel });

  t.throws(getConfig, 'throws when invalid');

  t.end();
});
