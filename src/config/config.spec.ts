import { expect } from 'chai';
import getConfig from './config';

describe('Config', () => {
  let environmentSnapShot: NodeJS.ProcessEnv;

  before(() => {
    environmentSnapShot = { ...process.env };
  });

  after(() => {
    process.env = environmentSnapShot;
  });

  beforeEach(() => {
    Object.assign(process.env, { MONGO_URI: 'mongodb://localhost/fake' });
  });

  it('applies the defaults', () => {
    expect(getConfig()).to.deep.equal({
      environment: 'local',
      server: { port: '3000' },
      mongo: { uri: 'mongodb://localhost/fake' },
      logger: { level: 'info' },
    });
  });

  it('configures the environment', () => {
    const runtimeEnv = 'dev';

    Object.assign(process.env, { RUNTIME_ENV: runtimeEnv });

    expect(getConfig()).to.haveOwnProperty('environment', runtimeEnv);
  });

  it('configures the server', () => {
    const configuredPort = '4000';
    Object.assign(process.env, { PORT: configuredPort });

    expect(getConfig())
      .to.haveOwnProperty('server')
      .that.deep.equals({ port: configuredPort });
  });

  it('configures our mongo', () => {
    const configuredUri = 'mongodb://localhost/db';
    Object.assign(process.env, { MONGO_URI: configuredUri });

    expect(getConfig())
      .to.haveOwnProperty('mongo')
      .that.deep.equals({ uri: configuredUri });
  });

  it('configures our logger', () => {
    const configuredLevel = 'warn';
    Object.assign(process.env, { LOG_LEVEL: configuredLevel });

    expect(getConfig())
      .to.haveOwnProperty('logger')
      .that.deep.equals({ level: configuredLevel });
  });

  it('throws when the logLevel is unknown', () => {
    const unknownLevel = 'darn';
    Object.assign(process.env, { LOG_LEVEL: unknownLevel });

    expect(getConfig).to.throw(
      'env/LOG_LEVEL must be equal to one of the allowed values',
    );
  });
});
