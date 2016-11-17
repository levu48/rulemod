const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT = process.env.PORT || 3013;
const logConfig = process.env.LOG4JS_CONFIG = process.env.LOG4JS_CONFIG || './config/default-logging-config.json';

const config = require(`./_${env}`);

const log4js = require('log4js');


log4js.layouts.addLayout('json', function () {const layouts = require('gstv-server-gondola').layouts; return function (loggingEvent) {return layouts.jsonLayout(loggingEvent);};});
log4js.configure(logConfig);
config.set('log4js', log4js);

config.set('server_port', PORT);
config.set('mongo_opts', {
  auth : {
    authdb: config.get('mongo_auth_db')
  }
});

export default config;
