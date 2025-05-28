import redis from "./services/redisClient.js";

export default function (io) {
  io.on("connection", (socket) => {
    console.log("🟢 New client connected");

    socket.on("join-pad", async (padId) => {
      socket.join(padId);
      const cached = await redis.get(padId);
      if (cached) {
        socket.emit("pad-content", cached);
      }
    });

    socket.on("update-pad", async ({ padId, html }) => {
      await redis.set(padId, html, "EX", 2 * 24 * 60 * 60); // 2 days
      socket.to(padId).emit("pad-content", html);
    });

    socket.on("clear-pad", async (padId) => {
      await redis.del(padId);
      socket.to(padId).emit("clear-pad");
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected");
    });
  });
}
