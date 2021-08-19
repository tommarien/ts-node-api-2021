import { randomUUID } from 'crypto';
import fastify from 'fastify';
import { Config } from './config/config';

export default function createServer(config: Config): ReturnType<typeof fastify> {
  return fastify({
    requestIdHeader: 'x-request-id',
    genReqId: () => randomUUID(),
    trustProxy: true,
    disableRequestLogging: true,
    logger: { level: config.logger.level },
  });
}
