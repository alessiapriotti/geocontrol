import { createGateway, deleteGateway, getAllGateway, getGatewayByMacAddress, updateGateway } from "@controllers/gatewayController";
import { authenticateUser } from "@middlewares/authMiddleware";
import { GatewayFromJSON } from "@models/dto/Gateway";
import AppError from "@models/errors/AppError";
import { UserType } from "@models/UserType";
import { Router } from "express";

const router = Router({ mergeParams: true });

// Get all gateways (Any authenticated user)
router.get("",authenticateUser([UserType.Admin,UserType.Operator,UserType.Viewer]), async(req, res, next) => {
  try {
    res.status(200).json(await getAllGateway(req.params.networkCode));
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
router.get("/:gatewayMac",authenticateUser([UserType.Admin,UserType.Operator,UserType.Viewer]), async(req, res, next) => {
  try {
    res.status(200).json(await getGatewayByMacAddress(req.params.gatewayMac, req.params.networkCode));
  } catch (error) {
    next(error);
  }
});

// Update a gateway (Admin & Operator)
router.patch("/:gatewayMac",authenticateUser([UserType.Admin, UserType.Operator]), async (req, res, next) => {
  try {
    await updateGateway(req.params.networkCode, req.params.gatewayMac, GatewayFromJSON(req.body));
    res.status(204).json({ message: "Gateway updated successfully" });
    } catch (error) {
      next(error);
    }
});

// Delete a gateway (Admin & Operator)
router.delete("/:gatewayMac", authenticateUser([UserType.Admin, UserType.Operator]), async (req, res, next) => {
  try {
    await deleteGateway(req.params.gatewayMac, req.params.networkCode);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
