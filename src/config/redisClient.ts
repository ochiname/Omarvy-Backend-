import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
  // ❌ Remove TLS section
});

redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Connected to Redis Cloud successfully (non-SSL)!");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
})();

export default redisClient;
