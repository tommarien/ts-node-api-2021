import { randomUUID } from 'crypto';
import fastify from 'fastify';
import autoLoad from 'fastify-autoload';
import swagger from 'fastify-swagger';
import sensible from 'fastify-sensible';
import path from 'path';
import { version } from '../package.json';
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
  });

  server.register(sensible);

  if (config.environment !== 'pro') {
    server.register(swagger, {
      routePrefix: '/docs',
      exposeRoute: true,
      swagger: {
        info: {
          title: 'WebShop Demo API',
          description: 'An api build with fastify',
          version,
        },
        tags: [{ name: 'product-category', description: 'Product Category' }],
      },
    });
  }

  server.register(autoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: config,
  });

  server.register(autoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...config, prefix: '/api' },
  });

  return server;
}
