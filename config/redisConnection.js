const { createClient } = require('redis');
const redis = require('redis');

const client = redis.createClient({
    host: 'redis', 
    port: 6379
  });
  

client.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  if (!client.isOpen) {
    await client.connect();
  }
})();



module.exports = client;
