// testRedis.js
import Redis from "ioredis";

const client = new Redis(
  "rediss://default:ATghAAIjcDE5ODBkNmRiMWQ3MWY0NGNhYjViZWQyNDdjY2I3OTdmN3AxMA@concise-gopher-14369.upstash.io:6379"
);

async function testRedis() {
  try {
    await client.set("foo", "bar");
    const value = await client.get("foo");
    console.log("✅ Redis test successful. Value of foo:", value);
  } catch (error) {
    console.error("❌ Redis test failed:", error);
  } finally {
    client.disconnect();
  }
}

testRedis();
