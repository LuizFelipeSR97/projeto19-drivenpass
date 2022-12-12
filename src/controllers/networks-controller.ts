import networksService from "@/services/networks-service";
import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/authentication";
import httpStatus from "http-status";


export async function getNetworks(req: AuthenticatedRequest, res: Response) {
  
  const {userId} = req;
  let id = Number(req.query.id);

  try {
    const networks = await networksService.getNetworks(userId, id)
    return res.status(httpStatus.OK).send(networks)

  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function postNetwork(req: AuthenticatedRequest, res: Response) {
  
  const {userId} = req;
  const {title, network, password} = req.body;

  try {
    const newNetwork = await networksService.postNetwork(title, network, password, userId)
    return res.status(httpStatus.CREATED).send(newNetwork)

  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function deleteNetwork(req: AuthenticatedRequest, res: Response) {
  
  const {userId} = req;
  const id = Number(req.params.id);
  
  try {
    const deleteNetwork = await networksService.deleteNetwork(id, userId)
    return res.status(httpStatus.OK).send(deleteNetwork)

  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}