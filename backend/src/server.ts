import app from "./app";
import { config } from "./config/env";

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║          TaskGuard Backend Server Started             ║
║                                                      ║
║  Server: http://localhost:${PORT}                        ║
║  Environment: ${config.nodeEnv}                         ║
║  Frontend URL: ${config.clientUrl}                   ║
╚══════════════════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\nServer shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\nServer terminating...");
  process.exit(0);
});
