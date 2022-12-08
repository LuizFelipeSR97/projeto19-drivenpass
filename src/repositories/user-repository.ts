import { prisma } from "@/config";
import { Prisma } from "@prisma/client";


async function createUser(email: string, password: string) {
  return prisma.user.create({
    data: {
      email,
      password
    }
  });
}

async function findUser(email:string) {
  return prisma.user.findFirst({
    where: {
      email
    }
  })
}

const userRepository = {
  createUser,
  findUser
};

export default userRepository;