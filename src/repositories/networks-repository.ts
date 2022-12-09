import { prisma } from "@/config";
import { Prisma } from "@prisma/client";


async function getNetworks(userId: number) {
  return prisma.network.findMany({
    where: {
      userId
    }
  })
}

async function getNetworksById(id: number) {
  return prisma.network.findFirst({
    where: {
      id
    }
  })
}

async function getNetworkByTitle(title: string, userId: number) {
  return prisma.network.findFirst({
    where: {
      title,
      userId
    }
  })
}

async function getNetworkByIdAndUserId(id: number, userId: number) {
  return prisma.network.findFirst({
    where: {
      id,
      userId
    }
  })
}

async function postNetwork(title: string, network: string, password: string, userId:number) {
  return prisma.network.create({
    data: {
      title,
      network,
      password,
      userId
    }
  })
}

async function deleteNetwork(id: number) {
  return prisma.network.delete({
    where: {
      id
    }
  })
}

const networksRepository = {
  getNetworks,
  getNetworksById,
  getNetworkByTitle,
  getNetworkByIdAndUserId,
  postNetwork,
  deleteNetwork
};

export default networksRepository;