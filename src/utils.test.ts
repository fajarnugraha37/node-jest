import { userUtils } from "./utils";

describe("userUtils", () => {
  describe("formatName", () => {
    test("should convert a name to uppercase", () => {
      expect(userUtils.formatName("john doe")).toBe("JOHN DOE");
      expect(userUtils.formatName("Jane Smith")).toBe("JANE SMITH");
      expect(userUtils.formatName("TEST NAME")).toBe("TEST NAME");
      expect(userUtils.formatName("")).toBe("");
    });
  });
});
