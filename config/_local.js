const config = new Map();

config.set('env', 'local');
config.set('server_host', 'localhost');

const MONGO_HOST = 'localhost:27017';
const MONGO_DB   = 'scheduling';
config.set('mongo_db', MONGO_DB);
config.set('mongo_host', MONGO_HOST);
config.set('mongo_server', (
  `mongodb://${MONGO_HOST}/${MONGO_DB}`
));

config.set('log_enabled', true);
config.set('log_format', 'dev');

export default config;
