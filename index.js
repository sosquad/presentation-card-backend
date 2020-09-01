const http = require('http');
const express = require('express');
const kraken = require('kraken-js');
const cors = require('cors');
const logger = require('./lib/logger');
const options = require('./lib/start-options.js');

const defaultPort = 8000;

const app = express();

app.use(cors());

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
