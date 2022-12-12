import credentialsService from "@/services/credentials-service";
import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/authentication";
import httpStatus from "http-status";


export async function getCredentials(req: AuthenticatedRequest, res: Response) {
  
  const {userId} = req;
  let id = Number(req.query.id);

  try {
    const credentials = await credentialsService.getCredentials(userId, id)
    return res.status(httpStatus.OK).send(credentials)

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

export async function postCredential(req: AuthenticatedRequest, res: Response) {
  
  const {userId} = req;
  const {title, url, username, password} = req.body;

  try {
    const newCredential = await credentialsService.postCredential(title, url, username, password, userId)
    return res.status(httpStatus.CREATED).send(newCredential)

  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function deleteCredential(req: AuthenticatedRequest, res: Response) {
  
  const {userId} = req;
  const id = Number(req.params.id);
  
  try {
    const deleteCredential = await credentialsService.deleteCredential(id, userId)
    return res.status(httpStatus.OK).send(deleteCredential)

  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}