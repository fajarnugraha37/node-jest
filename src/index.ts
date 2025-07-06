import { UserService } from "./user-service";

if (process.env.NODE_ENV !== "test") {
  main().catch(console.error);
}

export async function main() {
  const userService = new UserService();
  const user = await userService.getFormattedUser("123");
  console.log("Fetched user:", user);
  await userService.createUser("456", "John Doe");
}
