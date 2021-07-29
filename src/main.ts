import server from './server.js';

server.listen(3000).catch((err) => {
  server.log.error(err);
  process.exit(1);
});
