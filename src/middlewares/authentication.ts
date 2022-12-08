import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";

import { unauthorizedError } from "@/errors";

type JWTPayload = {
    userId: number;
  };

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    req.userId = userId;

    return next();
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
  }
}

export type AuthenticatedRequest = Request & JWTPayload;
