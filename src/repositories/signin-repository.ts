import { prisma } from "@/config";
import { Prisma } from "@prisma/client";


async function createSession(userId: number) {
  return prisma.
}

const signinRepository = {
  createSession
};

export default signinRepository;