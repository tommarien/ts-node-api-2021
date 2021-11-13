import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { MongoClient, ObjectId } from 'mongodb';
import { Config } from '../../config/config';
import { Db, getDb, registerClient } from '../../db/mongodb';

export interface FastifyMongo {
  client: MongoClient;
  db: Readonly<Db>;
  ObjectId: typeof ObjectId;
}

const mongodb: FastifyPluginAsync<Config> = async (instance, config) => {
  const client = new MongoClient(config.mongo.uri);
  await client.connect();

  registerClient(client);

  const mongo: FastifyMongo = {
    client,
    db: getDb(client),
    ObjectId,
  };

  instance.decorate('mongo', mongo);
  instance.addHook('onClose', () => client.close());
};

export default fp(mongodb);
