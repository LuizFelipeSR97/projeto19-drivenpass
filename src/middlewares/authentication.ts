import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";

import { unauthorizedError } from "@/errors";
import { prisma } from "@/config";

type JWTPayload = {
    userId: number;
  };

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());

  //O que seria?
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    const session = await prisma.session.findFirst({
      where: {
        token,
      },
    });
    if (!session) return res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());

    req.userId = userId;
    //TODO mudar aqui
    return next();
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
  }
}

function generateUnauthorizedResponse(res: Response) {
  res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
}

export type AuthenticatedRequest = Request & JWTPayload;
