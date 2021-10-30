import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import swagger from 'fastify-swagger';
import { Config } from '../../config/config';
import { version } from '../../../package.json';

const swaggerPlugin: FastifyPluginCallback<Config> = (instance, opts, done) => {
  if (opts.environment !== 'pro') {
    instance.register(swagger, {
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


  done();
};

export default fp(swaggerPlugin);
