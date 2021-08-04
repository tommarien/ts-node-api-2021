import { randomUUID } from 'crypto';
import fastify from 'fastify';
import config from './config.js';

export default function createServer(): ReturnType<typeof fastify> {
  const server = fastify({
    trustProxy: true,
    disableRequestLogging: true,
    logger: { level: config.logger.level },
    requestIdHeader: 'x-request-id',
    genReqId: () => randomUUID(),
  });

  return server;
}
