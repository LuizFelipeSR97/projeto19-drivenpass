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

async function getCredentialByTitle(title: string, userId: number) {
  return prisma.credential.findFirst({
    where: {
      title,
      userId
    }
  })
}

async function getCredentialByIdAndUserId(id: number, userId: number) {
  return prisma.credential.findFirst({
    where: {
      id,
      userId
    }
  })
}

async function postCredential(title: string, url: string, username: string, password: string, userId:number) {
  return prisma.credential.create({
    data: {
      title,
      url,
      username,
      password,
      userId
    }
  })
}

async function deleteCredential(id: number) {
  return prisma.credential.delete({
    where: {
      id
    }
  })
}

const credentialsRepository = {
  getCredentials,
  getCredentialsById,
  getCredentialByTitle,
  getCredentialByIdAndUserId,
  postCredential,
  deleteCredential
};

export default credentialsRepository;