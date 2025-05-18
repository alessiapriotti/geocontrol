import { createGateway, deleteGateway, getAllGateway } from "@controllers/gatewayController";
import { authenticateUser } from "@middlewares/authMiddleware";
import { GatewayFromJSON } from "@models/dto/Gateway";
import AppError from "@models/errors/AppError";
import { UserType } from "@models/UserType";
import { Router } from "express";

const router = Router({ mergeParams: true });

// Get all gateways (Any authenticated user)
router.get("", (req, res, next) => {
  try {
    res.status(200).json(getAllGateway());
  } catch (error) {
    next(error);
  }
});

// Create a new gateway (Admin & Operator)
router.post("", authenticateUser([UserType.Admin, UserType.Operator]), async (req, res, next) => {
  try {
    await createGateway(GatewayFromJSON(req.body), req.params.networkCode);
    res.status(201).json({ message: "Gateway created successfully" });
  } catch (error) {
    next(error);
  }
});

// Get a specific gateway (Any authenticated user)
router.get("/:gatewayMac", (req, res, next) => {
  throw new AppError("Method not implemented", 500);
});

// Update a gateway (Admin & Operator)
router.patch("/:gatewayMac", (req, res, next) => {
  throw new AppError("Method not implemented", 500);
});

// Delete a gateway (Admin & Operator)
router.delete("/:gatewayMac", authenticateUser([UserType.Admin, UserType.Operator]), async (req, res, next) => {
  try {
    await deleteGateway(req.params.gatewayMac);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
