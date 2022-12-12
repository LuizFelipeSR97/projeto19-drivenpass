import bcrypt from "bcrypt";
import faker from "@faker-js/faker";
import { Credential, Network, User } from "@prisma/client";
import { prisma } from "@/config";

export async function createUser(params: Partial<User> = {}): Promise<User> {
  const incomingPassword = params.password || faker.internet.password(10);
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  return prisma.user.create({
    data: {
      email: params.email || faker.internet.email(),
      password: hashedPassword,
    },
  });
}

export async function createCredential(userId:number): Promise<Credential> {

  return prisma.credential.create({
    data: {
      title: faker.company.companyName(),
      url: faker.internet.url(),
      username: faker.company.companyName(),
      password: faker.internet.password(6),
      userId
    },
  });
}

export async function createNetwork(userId:number): Promise<Network> {

  return prisma.network.create({
    data: {
      title: faker.company.companyName(),
      network: faker.company.companyName(),
      password: faker.internet.password(6),
      userId
    },
  });
}