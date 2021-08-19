import { test, beforeEach } from 'tap';
import getConfig from './config';

beforeEach(() => {
  Object.assign(process.env, { MONGO_URI: 'mongodb://localhost/fake' });
});

test('it applies the defaults', (t) => {
  t.plan(1);
  t.same(getConfig(), {
    isProduction: false,
    server: { port: '3000' },
    mongo: { uri: 'mongodb://localhost/fake' },
    logger: { level: 'info' },
  });
});

test('isProduction', (t) => {
  t.plan(2);

  Object.assign(process.env, { NODE_ENV: 'development' });
  t.hasStrict(getConfig(), { isProduction: false }, 'is false when NODE_ENV is development');

  Object.assign(process.env, { NODE_ENV: 'production' });
  t.hasStrict(getConfig(), { isProduction: true }, 'is true when NODE_ENV is production');
});

test('server', (t) => {
  t.plan(1);

  const configuredPort = '4000';
  Object.assign(process.env, { PORT: configuredPort });

  t.hasStrict(getConfig(), { server: { port: configuredPort } }, 'port is set as configured');
});

test('mongo', (t) => {
  t.plan(1);

  const configuredUri = 'mongodb://localhost/db';
  Object.assign(process.env, { MONGO_URI: configuredUri });

  t.hasStrict(getConfig(), { mongo: { uri: configuredUri } }, 'uri is set as configured');
});

test('logger', (t) => {
  t.plan(2);

  const configuredLevel = 'warn';
  Object.assign(process.env, { LOG_LEVEL: configuredLevel });

  t.hasStrict(getConfig(), { logger: { level: configuredLevel } }, 'level is set as configured');

  const unknownLevel = 'darn';
  Object.assign(process.env, { LOG_LEVEL: unknownLevel });

  t.throws(getConfig, 'throws when invalid');
});
