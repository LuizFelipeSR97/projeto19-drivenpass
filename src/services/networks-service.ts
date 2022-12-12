import networksRepository from "@/repositories/networks-repository";
import { Credential, Network } from "@prisma/client";
import credentialsRepository from "@/repositories/credentials-repository";
import { duplicatedTitleError, notFoundError, unauthorizedError } from "@/errors";

const Cryptr = require('cryptr');
const cryptr = new Cryptr('secretKey');

async function getNetworks(userId: number, id: number) {

  if (isNaN(id)){
    const networks = await networksRepository.getNetworks(userId);

    const decryptedNetworks = networks.map(net=>{
      //const decryptedPassword=cryptr.decrypt(net.password)
      //net.password=decryptedPassword
      net.password="Password descriptografado aqui"
      return net
    })

    return decryptedNetworks
  }

  const network = await networksRepository.getNetworksById(id)

  if (!network){
    throw notFoundError()
  }

  if(network.userId!==userId){
    throw unauthorizedError()
  }

  //const decryptedPassword = cryptr.decrypt(network.password);
  //const decryptedNetwork = {...network, password: decryptedPassword}
  const decryptedNetwork = {...network, password: "Password descriptografado aqui"}

  return decryptedNetwork
}

async function postNetwork(title: string, network: string, password: string, userId:number) {

  const encryptedPassword = cryptr.encrypt(password);

  const existingNetwork = await networksRepository.getNetworkByTitle(title, userId)

  if(existingNetwork){
    throw duplicatedTitleError()
  }

  const createdNetwork = await networksRepository.postNetwork(title, network, encryptedPassword, userId)
  return createdNetwork
}

async function deleteNetwork(id: number, userId: number) {

  if (isNaN(id)){
    throw notFoundError()
  }

  const searchedNetwork = await networksRepository.getNetworkByIdAndUserId(id, userId)

  if (!searchedNetwork){
    throw notFoundError()
  }

  const deletedNetwork = await networksRepository.deleteNetwork(id)
  
  return deletedNetwork
}

const networksService = {
  getNetworks,
  postNetwork,
  deleteNetwork
};

export type CreateNetworkParams = Omit<Network, "id" | "userId">;
export default networksService;