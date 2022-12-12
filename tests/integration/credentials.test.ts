import app, { init } from "@/app";
import faker, { FakerError } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser, createCredential } from "../factories";
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

describe("GET /credentials", () => {

  it("should respond with status 401 when no token was sent", async () => {

    const response = await server.get("/credentials");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 when invalid token was sent", async () => {

    const token = "Bearer "+faker.lorem.word(15);
    const response = await server.get("/credentials").set({ Authorization: token })

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when body is valid", () => {

    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(10),
    });

    it("should respond with empty array when user doesn't have credentials yet", async () => {
      const body = generateValidBody();
      const user:User = await createUser(body);
      const token = await generateValidToken(user);

      const response = await server.get("/credentials").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    });

    it("should respond with objects array when user has at least one credential", async () => {

      const body = generateValidBody();
      const user:User = await createUser(body);
      const token = await generateValidToken(user);
      const credential = await createCredential(user.id);
      const response = await server.get("/credentials").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([credential]);
    });

    describe("when there is a query in url", () => {

      it("if the number passed in id's query doesn't match any credential, should respond with status 404", async () => {
        
      const body = generateValidBody();
      const user = await createUser(body);
      const token = await generateValidToken(user);

      const response = await server.get("/credentials?id=1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);

      });

      it("if the number passed in id's query is from a credential that is not user's, should respond with status 401", async () => {
        
      const body = generateValidBody();
      const body2 = generateValidBody();
      const user = await createUser(body);
      const user2 = await createUser(body2);
      const token = await generateValidToken(user);
      const credential = await createCredential(user2.id)
      const response = await server.get(`/credentials?id=${credential.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);

      });

      it("if the number passed in id's query is from a user's credential, should respond with status 200 and an object with this credential infos", async () => {
        
      const body = generateValidBody();
      const user = await createUser(body);
      const token = await generateValidToken(user);
      const credential = await createCredential(user.id)
      const credentialId = credential.id
      const response = await server.get(`/credentials?id=${credential.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.body).toBe({...credential});
      expect(response.status).toBe(httpStatus.OK);

      });
    });
  });

});

describe("POST /credentials", () => {

  const generateNewValidBody = () => ({
    title: faker.company.companyName(),
    url: faker.internet.url(),
    username: faker.company.companyName(),
    password: faker.internet.password()
  });

  it("should respond with status 401 when no token was sent", async () => {
    
    const newBody = generateNewValidBody()
    const response = await server.post("/credentials").send(newBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 when invalid token was sent", async () => {

    const newBody = generateNewValidBody()
    const token = "Bearer "+faker.lorem.word(15);
    const response = await server.post("/credentials").set({ Authorization: token }).send(newBody);

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
      const credential = await createCredential(user.id)

      const response = await server.post("/credentials").set("Authorization", `Bearer ${token}`).send({...newBody, title: credential.title});

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
      const response = await server.post("/credentials").set("Authorization", `Bearer ${token}`).send(newBody);

      expect(response.body).toEqual({...newBody,userId: user.id, id: expect.any(Number), password: expect.any(String)
      })
      expect(response.status).toBe(httpStatus.CREATED);
    });
    
  });
  
});

describe("DELETE /credentials/:id", () => {

  it("should respond with status 401 when no token was sent", async () => {

    const response = await server.delete("/credentials/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 when invalid token was sent", async () => {

    const token = "Bearer "+faker.lorem.word(15);
    const response = await server.delete("/credentials/1").set({ Authorization: token });

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
      const credential = await createCredential(user.id);
      const response = await server.delete("/credentials/a"+(credential.id+1)).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when id is not a number ", async () => {

      const body = generateValidBody();
      const user:User = await createUser(body);
      const token = await generateValidToken(user);
      const credential = await createCredential(user.id);
      const response = await server.delete("/credentials/a").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when id is not a user's credential ", async () => {

      const body = generateValidBody();
      const body2 = generateValidBody();
      const user:User = await createUser(body);
      const user2:User = await createUser(body2);
      const token = await generateValidToken(user);
      const credential = await createCredential(user2.id);
      const response = await server.delete("/credentials/"+credential.id).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and the credential deleted when id is an user's credential ", async () => {

      const body = generateValidBody();
      const user:User = await createUser(body);
      const token = await generateValidToken(user);
      const credential = await createCredential(user.id);
      const response = await server.delete("/credentials/"+credential.id).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(credential);
    });

  });

});
