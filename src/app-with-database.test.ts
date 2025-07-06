import { createApp } from "./app-with-database";

describe("App", () => {
  let app: any;
  let mockDatabase: any;

  beforeEach(() => {
    mockDatabase = {
      createUser: jest.fn(),
    };
    app = createApp(mockDatabase);
  });

  describe("POST /users", () => {
    describe("given a username and password", () => {
      test("should respond with a 200 status code", async () => {
        mockDatabase.createUser.mockResolvedValue(1); // Mock a successful user creation
        const request = require("supertest");
        const response = await request(app).post("/users").send({
          username: "username",
          password: "password",
        });
        expect(response.statusCode).toBe(200);
      });

      test("should specify json in the content type header", async () => {
        mockDatabase.createUser.mockResolvedValue(1);
        const request = require("supertest");
        const response = await request(app).post("/users").send({
          username: "username",
          password: "password",
        });
        expect(response.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });

      test("response has userId", async () => {
        mockDatabase.createUser.mockResolvedValue(123); // Mock a specific userId
        const request = require("supertest");
        const response = await request(app).post("/users").send({
          username: "username",
          password: "password",
        });
        expect(response.body.userId).toBe(123);
      });

      test("should call database.createUser with correct arguments", async () => {
        mockDatabase.createUser.mockResolvedValue(1);
        const request = require("supertest");
        await request(app).post("/users").send({
          username: "testuser",
          password: "testpassword",
        });
        expect(mockDatabase.createUser).toHaveBeenCalledWith(
          "testuser",
          "testpassword"
        );
      });
    });

    describe("when the username and password is missing", () => {
      test("should respond with a status code of 400", async () => {
        const request = require("supertest");
        const bodyData = [
          { username: "username" },
          { password: "password" },
          {},
        ];
        for (const body of bodyData) {
          const response = await request(app).post("/users").send(body);
          expect(response.statusCode).toBe(400);
        }
      });
    });
  });
});
