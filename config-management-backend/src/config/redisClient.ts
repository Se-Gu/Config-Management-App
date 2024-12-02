import { createClient, RedisClientType } from "redis";

interface NewRedisClientType extends RedisClientType {
  delPattern(pattern: string): Promise<void>;
  isConnected: boolean;
}

let redisClient: NewRedisClientType;

try {
  redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  }) as NewRedisClientType;

  redisClient.isConnected = false;

  let lastErrorLog = 0;
  const errorLogInterval = 60 * 1000;

  redisClient.on("error", (err) => {
    const now = Date.now();
    if (now - lastErrorLog > errorLogInterval) {
      console.error("Redis Client Error", err);
      lastErrorLog = now;
    }
    redisClient.isConnected = false;
  });

  redisClient.on("connect", () => {
    redisClient.isConnected = true;
    console.log("Redis client connected.");
  });

  redisClient.on("end", () => {
    redisClient.isConnected = false;
    console.warn("Redis client disconnected.");
  });

  redisClient.delPattern = async (pattern: string): Promise<void> => {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(`Deleted keys matching pattern: ${pattern}`);
      } else {
        console.log(`No keys found for pattern: ${pattern}`);
      }
    } catch (error) {
      console.error(`Error deleting keys with pattern ${pattern}:`, error);
    }
  };

  console.log("Redis client initialized.");
} catch (error) {
  console.error(
    "Failed to initialize Redis client. Redis will be unavailable.",
    error
  );
  redisClient = null!;
}

export const connectRedis = async () => {
  if (!redisClient) {
    console.warn("Redis client is unavailable. Skipping connection.");
    return;
  }

  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error(
      "Failed to connect to Redis. Running without caching:",
      error
    );
    redisClient.isConnected = false;
    redisClient = null!;
  }
};

export default redisClient;
