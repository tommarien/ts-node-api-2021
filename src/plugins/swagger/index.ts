import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { version } from '../../../package.json';
import { Config } from '../../config/config';
import { Tag } from '../../tag';

const swaggerPlugin: FastifyPluginCallback<Config> = (instance, opts, done) => {
  if (opts.environment !== 'pro') {
    instance.register(swagger, {
      swagger: {
        info: {
          title: 'WebShop Demo API',
          description: 'An api build with fastify',
          version,
        },
        tags: [{ name: Tag.Genre, description: 'Genre management' }],
      },
    });

    instance.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        validatorUrl: null,
      },
    });
  }

  done();
};

export default fp(swaggerPlugin);
