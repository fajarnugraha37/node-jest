import { app } from "./app";

main();
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
