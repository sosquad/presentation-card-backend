const http = require('http');
const express = require('express');
const kraken = require('kraken-js');
const logger = require('@23people/moonbase-mongo-logger');

const options = require('./init');

const defaultPort = 8000;

const app = express();

app.use(kraken(options));
app.on('start', () => {
  logger.info('Application ready to serve requests.');

  logger.info(`Environment: ${app.kraken.get('env:env')}`);
});

const server = http.createServer(app);
server.listen(process.env.PORT || defaultPort);
server.on('listening', function serve() {
  logger.info(this.address());
  logger.info(`Server listening on ${this.address().address}:${this.address().port}`);
});
