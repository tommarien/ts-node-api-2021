import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { MongoClient, ObjectId } from 'mongodb';
import { Config } from '../../config/config';
import { DbContext } from '../../db/db-context';

export interface FastifyMongo {
  client: MongoClient;
  db: DbContext;
  ObjectId: typeof ObjectId;
}

const mongodb: FastifyPluginAsync<Config> = async (instance, config) => {
  const client = new MongoClient(config.mongo.uri);
  await client.connect();

  const mongo: FastifyMongo = {
    client,
    db: new DbContext(client),
    ObjectId,
  };

  instance.decorate('mongo', mongo);
  instance.addHook('onClose', () => client.close());
};

export default fp(mongodb, { name: 'fastify-mongo' });
