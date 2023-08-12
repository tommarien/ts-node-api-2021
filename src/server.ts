import { randomUUID } from 'node:crypto';
import path from 'node:path';
import autoLoad from '@fastify/autoload';
import Ajv from 'ajv';
import fastify from 'fastify';
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
          ajv.addFormat('object-id', /^[\da-fA-F]{24}$/);
        },
      ],
    },
  });

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
