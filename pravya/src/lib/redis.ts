import { Redis } from "ioredis";

export const redisConnection = {
  connection: new Redis(process.env.REDIS_URL || "redis://localhost:6379"),
};
