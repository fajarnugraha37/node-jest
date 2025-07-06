import { app } from "./app";

// need to check whether running in test or not, if in test no need to run main, test command is npm run test which is jest
// This is a workaround to prevent the server from starting when running tests.
// In a real application, you might use a separate entry point for tests or
// conditionally start the server based on an environment variable.
if (process.env.NODE_ENV !== "test") {
    main();
}

export function main() {
  const closeFunc = (() => {
    const server = app.listen(8080, () => console.log("listening on port 8080"));

    return () => {
      server.close();
      console.log("Server closed");
    };
  })();

  process.on("SIGINT", closeFunc);
  process.on("SIGTERM", closeFunc);
}
