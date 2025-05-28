import redis from "../services/redisClient.js";

export async function getPadMediaTotalSize(padId) {
  const meta = await redis.get(`${padId}-media`);
  if (!meta) return 0;

  const files = JSON.parse(meta);
  return files.reduce((sum, f) => sum + f.size, 0);
}

export async function saveMediaMeta(padId, fileInfo) {
  const key = `${padId}-media`;
  const current = await redis.get(key);
  const updated = current ? [...JSON.parse(current), fileInfo] : [fileInfo];
  await redis.set(key, JSON.stringify(updated));
}
