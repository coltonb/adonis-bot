/*
Modifies prefix of text prediction keys. No longer needed. Preserved only as a reference.
*/

require("dotenv").config();

const redis = require("async-redis");
const redisClient = redis.createClient({ url: process.env.REDISCLOUD_URL });

async function batchRenameKeys() {
  const keys = await redisClient.keys("text-predictor:*");
  const multi = await redisClient.multi();

  const promises = [];

  for (key of keys) {
    const newKey = "text-predictor::" + key.slice(15);
    console.log(`${key} => ${newKey}`);
  }

  await Promise.all(promises);
  console.log(`Renamed ${keys.length} keys.`);
}

batchRenameKeys().then(process.exit);
