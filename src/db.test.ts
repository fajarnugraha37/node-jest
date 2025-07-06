import { Database } from "./db";

describe("Database", () => {
  let db: Database;

  beforeEach(() => {
    db = new Database();
  });
  test("getUser should return a user object with the given ID", async () => {
    const id = "123";
    const user = await db.getUser(id);
    expect(user).toEqual({ id, name: `User ${id}` });
  });

  test("saveUser should log the saving action", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    const user = { id: "456", name: "Test User" };
    await db.saveUser(user);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Saving user ${user.name} to database`
    );
    consoleSpy.mockRestore();
  });
});
