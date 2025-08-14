import { Queue } from "bullmq";
import { redisConnection } from "./redis";

export const resumeProcessingQueue = new Queue("resume-processing", redisConnection);
