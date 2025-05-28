// import { io } from "socket.io-client";

// const socket = io("http://localhost:4000", {
//   transports: ["websocket"],
// });

// export default socket;


// code2
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(SOCKET_URL || "http://localhost:4000", { // Fallback is optional but can be useful during initial setup/debugging
  transports: ["websocket"],
});

// You can add a check or log for debugging:
if (!SOCKET_URL) {
  console.warn("VITE_SOCKET_URL is not defined. Falling back to default or potentially failing.");
} else {
  console.log("Connecting socket to:", SOCKET_URL);
}

export default socket;