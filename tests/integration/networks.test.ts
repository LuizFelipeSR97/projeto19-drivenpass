import app, { init } from "@/app";
import faker, { FakerError } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser, createNetwork } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { User } from "@prisma/client";

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /networks", () => {

  it("should respond with status 401 when no token was sent", async () => {

    const response = await server.get("/networks");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 when invalid token was sent", async () => {

    const token = "Bearer "+faker.lorem.word(15);
    const response = await server.get("/networks").set({ Authorization: token })

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when body is valid", () => {

    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(10),
    });

    it("should respond with empty array when user doesn't have networks yet", async () => {
      const body = generateValidBody();
      const user:User = await createUser(body);
      const token = await generateValidToken(user);

      const response = await server.get("/networks").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    });

    it("should respond with objects array when user has at least one network", async () => {

      const body = generateValidBody();
      const user:User = await createUser(body);
      const token = await generateValidToken(user);
      const network = await createNetwork(user.id);
      const response = await server.get("/networks").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([network]);
    });

    describe("when there is a query in url", () => {

      it("if the number passed in id's query doesn't match any network, should respond with status 404", async () => {
        
      const body = generateValidBody();
      const user = await createUser(body);
      const token = await generateValidToken(user);

      const response = await server.get("/networks?id=1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);

      });

      it("if the number passed in id's query is from a network that is not user's, should respond with status 401", async () => {
        
      const body = generateValidBody();
      const body2 = generateValidBody();
      const user = await createUser(body);
      const user2 = await createUser(body2);
      const token = await generateValidToken(user);
      const network = await createNetwork(user2.id)
      const response = await server.get(`/networks?id=${network.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);

      });

      it("if the number passed in id's query is from a user's network, should respond with status 200 and an object with this network infos", async () => {
        
      const body = generateValidBody();
      const user = await createUser(body);
      const token = await generateValidToken(user);
      const network = await createNetwork(user.id)
      const networkId = network.id
      const response = await server.get(`/networks?id=${network.id}`).set("Authorization", `Bearer ${token}`);

      //expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toBe("Fazer o toEqual e ajeitar o tipo do body");

      });
    });
  });

});

describe("POST /networks", () => {

  const generateNewValidBody = () => ({
    title: faker.company.companyName(),
    network: faker.company.companyName(),
    password: faker.internet.password(6),
  });

  it("should respond with status 401 when no token was sent", async () => {
    
    const newBody = generateNewValidBody()
    const response = await server.post("/networks").send(newBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 when invalid token was sent", async () => {

    const newBody = generateNewValidBody()
    const token = "Bearer "+faker.lorem.word(15);
    const response = await server.post("/networks").set({ Authorization: token }).send(newBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when body is valid", () => {

    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(10),
    });

    it("should respond with status 400 when existing title was sent", async () => {

      const body = {
        email: faker.internet.email(),
        password: faker.internet.password(10),
      }
      const user:User = await createUser(body);
      const token = await generateValidToken(user);
      const newBody = {
        title: faker.company.companyName(),
        url: faker.internet.url(),
        username: faker.company.companyName(),
        password: faker.internet.password()
      }
      const network = await createNetwork(user.id)

      const response = await server.post("/networks").set("Authorization", `Bearer ${token}`).send({...newBody, title: network.title});

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

    it("should respond with object created", async () => {

      const body = {
        email: faker.internet.email(),
        password: faker.internet.password(10),
      };
      const user:User = await createUser(body);
      const token = await generateValidToken(user);
      const newBody = generateNewValidBody()
      const response = await server.post("/networks").set("Authorization", `Bearer ${token}`).send(newBody);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({...newBody,userId: user.id, id: expect.any(Number), password: expect.any(String)
      });
    });
    
  });
  
});

describe("DELETE /networks/:id", () => {

  it("should respond with status 401 when no token was sent", async () => {

    const response = await server.delete("/networks/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 when invalid token was sent", async () => {

    const token = "Bearer "+faker.lorem.word(15);
    const response = await server.delete("/networks/1").set({ Authorization: token });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {

    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(10),
    });

    it("should respond with status 404 when id does not exist", async () => {

      const body = generateValidBody();
      const user:User = await createUser(body);
      const token = await generateValidToken(user);
      const network = await createNetwork(user.id);
      const response = await server.delete("/networks/a"+(network.id+1)).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when id is not a number ", async () => {

      const body = generateValidBody();
      const user:User = await createUser(body);
      const token = await generateValidToken(user);
      const network = await createNetwork(user.id);
      const response = await server.delete("/networks/a").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when id is not a user's network ", async () => {

      const body = generateValidBody();
      const body2 = generateValidBody();
      const user:User = await createUser(body);
      const user2:User = await createUser(body2);
      const token = await generateValidToken(user);
      const network = await createNetwork(user2.id);
      const response = await server.delete("/networks/"+network.id).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and the network deleted when id is an user's network ", async () => {

      const body = generateValidBody();
      const user:User = await createUser(body);
      const token = await generateValidToken(user);
      const network = await createNetwork(user.id);
      const response = await server.delete("/networks/"+network.id).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(network);
    });

  });

});
