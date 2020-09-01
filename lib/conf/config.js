let configuration = null;

const appConfig = {
  config: conf => {
    configuration = conf;
  },

  get: confName => (configuration ? configuration.get(confName) : '')
};

module.exports = appConfig;
