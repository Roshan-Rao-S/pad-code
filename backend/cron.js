const cron = require("node-cron");
const { redis } = require("./services/redisClient");
const cloudinary = require("cloudinary").v2;

cron.schedule("0 * * * *", async () => {
  console.log("Running cleanup task...");
  const keys = await redis.keys("media:*");

  for (const key of keys) {
    const padId = key.split(":")[1];
    const exists = await redis.get(padId);
    if (!exists) {
      // pad expired
      const folder = `pads/${padId}`;
      await cloudinary.api.delete_resources_by_prefix(folder);
      await cloudinary.api.delete_folder(folder);
      await redis.del(key);
      console.log(`Deleted media for expired pad: ${padId}`);
    }
  }
});
