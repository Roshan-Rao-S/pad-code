import redis from "../services/redisClient.js";

export const getPad = async (req, res) => {
  const pad = await redis.get(req.params.padId);
  res.json(pad ? JSON.parse(pad) : []);
};

export const clearPad = async (req, res) => {
  await redis.del(req.params.padId);
  res.json({ success: true });
};
