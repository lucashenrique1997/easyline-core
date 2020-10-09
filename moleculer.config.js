const start = new Date();

module.exports = {
  transporter: false,

  maxCallLevel: 100,
  heartbeatInterval: 5,
  heartbeatTimeout: 15,

  tracking: {
    enabled: false,
    shutdownTimeout: 5000,
  },

  disableBalancer: false,

  registry: {
    strategy: 'RoundRobin',
    preferLocal: true,
  },

  circuitBreaker: {
    enabled: false,
    threshold: 0.5,
    windowTime: 60,
    minRequestCount: 20,
    halfOpenTime: 10 * 1000,
  },

  bulkhead: {
    enabled: false,
    concurrency: 10,
    maxQueueSize: 100,
  },

  validation: true,
  validator: null,

  metrics: true,
  metricsRate: 1,

  statistics: true,

  internalServices: true,
  internalMiddlewares: true,

  hotReload: false,

  replCommands: null,

  cacher: {
    type: 'MemoryLRU',
    options: {
      ttl: 1800,
      max: 50,
    },
  },

  startDate: start,
};
