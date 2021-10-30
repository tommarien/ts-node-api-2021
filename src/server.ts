import Ajv from 'ajv';
import { randomUUID } from 'crypto';
import fastify from 'fastify';
import autoLoad from 'fastify-autoload';
import sensible from 'fastify-sensible';
import path from 'path';
import { Config } from './config/config';

export default function createServer(
  config: Config,
): ReturnType<typeof fastify> {
  const server = fastify({
    requestIdHeader: 'x-request-id',
    genReqId: () => randomUUID(),
    trustProxy: true,
    disableRequestLogging: true,
    logger: { level: config.logger.level },
    ajv: {
      plugins: [
        (ajv: Ajv) => {
          ajv.addFormat('slug', /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
        },
      ],
    },
  });

  server.register(sensible);

  server.register(autoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: config,
  });

  server.register(autoLoad, {
    dir: path.join(__dirname, 'routes'),
    ignorePattern: /.*(test|spec).ts/,
    options: { ...config, prefix: '/api' },
  });

  return server;
}
