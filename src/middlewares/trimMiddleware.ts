import { CONFIG } from "@config";
import { Request, Response, NextFunction } from "express";

export function trimBody(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Non fare trim se è autenticazione
  if (req.path.startsWith(CONFIG.ROUTES.V1_AUTH)) {
    return next();
  }
  
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
}

export function trimParamsAndQuery(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Trim dei params
  for (const key in req.params) {
    if (typeof req.params[key] === "string") {
      req.params[key] = req.params[key].trim();
    }
  }
  // Trim dei query params
  for (const key in req.query) {
    if (typeof req.query[key] === "string") {
      req.query[key] = req.query[key].trim();
    }
  }
  next();
}
