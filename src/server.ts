import fastify from 'fastify';
import { Config } from './config';

export default function createServer(config: Config): ReturnType<typeof fastify> {
  return fastify({
    trustProxy: true,
    disableRequestLogging: true,
    logger: { level: config.logger.level },
  });
}
