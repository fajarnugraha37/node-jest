import { main } from "./index";


describe("main", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test("should call console.log with the fetched user", async () => {
    await main();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Fetched user:",
      expect.objectContaining({ id: "123", name: "USER 123" })
    );
  });
});