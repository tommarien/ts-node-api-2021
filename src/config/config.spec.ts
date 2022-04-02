import getConfig from './config';

const env = { ...process.env };

describe('Config', () => {
  afterAll(() => {
    process.env = env;
  });

  beforeEach(() => {
    process.env = { MONGO_URI: 'mongodb://localhost/fake' };
  });

  it('applies the defaults', () => {
    expect(getConfig()).toEqual({
      environment: 'local',
      server: { port: '3000' },
      mongo: { uri: 'mongodb://localhost/fake' },
      logger: { level: 'info' },
    });
  });

  it('configures the environment', () => {
    const runtimeEnv = 'dev';

    Object.assign(process.env, { RUNTIME_ENV: runtimeEnv });

    expect(getConfig()).toHaveProperty('environment', runtimeEnv);
  });

  it('configures the server', () => {
    const configuredPort = '4000';
    Object.assign(process.env, { PORT: configuredPort });

    expect(getConfig()).toHaveProperty('server', {
      port: configuredPort,
    });
  });

  it('configures our mongo', () => {
    const configuredUri = 'mongodb://localhost/db';
    Object.assign(process.env, { MONGO_URI: configuredUri });

    expect(getConfig()).toHaveProperty('mongo', { uri: configuredUri });
  });

  it('configures our logger', () => {
    const configuredLevel = 'warn';
    Object.assign(process.env, { LOG_LEVEL: configuredLevel });

    expect(getConfig()).toHaveProperty('logger', { level: configuredLevel });
  });

  it('throws when the logLevel is unknown', () => {
    const unknownLevel = 'darn';
    Object.assign(process.env, { LOG_LEVEL: unknownLevel });

    expect(getConfig).toThrow(
      'env/LOG_LEVEL must be equal to one of the allowed values',
    );
  });
});
