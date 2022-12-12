import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import { string } from "joi";
import supertest from "supertest";
import { createUser } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /auth/signin", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/auth/signin");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/auth/signin").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(10),
    });

    it("should respond with status 401 if there is no user for given email", async () => {
      const body = generateValidBody();

      const response = await server.post("/auth/signin").send(body);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is a user for given email but password is not correct", async () => {
      const body = generateValidBody();
      await createUser(body);

      const response = await server.post("/auth/signin").send({
        ...body,
        password: faker.lorem.word(10),
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when credentials are valid", () => {
      it("should respond with status 200", async () => {
        
        const body = generateValidBody();
        await createUser(body);
        const response = await server.post("/auth/signin").send(body);

        expect(response.status).toBe(httpStatus.OK);
      });

      it("should respond with token", async () => {

        //Dar uma olhada se essa logica faz sentido
        
        const body = generateValidBody();
        await createUser(body);

        const response = await server.post("/auth/signin").send(body);

        expect(response.body).toEqual({
          token: expect.any(String)
        });
      });
    });
  });
});
