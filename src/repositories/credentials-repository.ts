import { prisma } from "@/config";
import { Prisma } from "@prisma/client";


async function getCredentials(userId: number) {
  return prisma.credential.findMany({
    where: {
      userId
    }
  })
}

async function getCredentialsById(id: number) {
  return prisma.credential.findFirst({
    where: {
      id
    }
  })
}

const credentialsRepository = {
  getCredentials,
  getCredentialsById
};

export default credentialsRepository;