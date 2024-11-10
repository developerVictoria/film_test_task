const Redis = require('ioredis');

let redis;

(async () => {
  redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
    commandTimeout: 5000
  });
  redis.on('error', (err) => {
    console.log(err);
  });
})();

async function getCache(key) {
  try {
    const cacheData = await redis.get(key);
    return cacheData;
  } catch (err) {
    return null;
  }
}

function setCache(key, data, ttl = 30) {
  try {
    redis.set(key, JSON.stringify(data), 'EX', ttl);
  } catch (err) {
    return null;
  }
}

module.exports = { getCache, setCache };
