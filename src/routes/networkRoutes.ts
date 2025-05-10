import { createNetwork, deleteNetwork, getAllNetworks, getNetwork, updateNetwork } from "@controllers/networkController";
import { authenticateUser } from "@middlewares/authMiddleware";
import { NetworkFromJSON } from "@dto/Network";
import AppError from "@models/errors/AppError";
import { UserType } from "@models/UserType";
import { Router } from "express";

const router = Router();

// Get all networks (Any authenticated user)
router.get("", async (req, res, next) => {
  try {
    res.status(200).json(await getAllNetworks());
  } catch (error) {
    next(error);
  }
});

// Create a new network (Admin & Operator)
router.post("", authenticateUser([UserType.Admin, UserType.Operator]), async (req, res, next) => {
  try {
    await createNetwork(NetworkFromJSON(req.body));
    res.status(201).json({ message: "Network created successfully" });
  } catch (error) {
    next(error);
  }
});

// Get a specific network (Any authenticated user)
router.get("/:networkCode", async (req, res, next) => {
  try {
    res.status(200).json(await getNetwork(req.params.networkCode));
  } catch (error) {
    next(error);
  }
});

// Update a network (Admin & Operator)
router.patch("/:networkCode", authenticateUser([UserType.Admin, UserType.Operator]), async (req, res, next) => {
  try {
    await updateNetwork(req.params.networkCode, NetworkFromJSON(req.body));
    res.status(201).json({ message: "Network updated successfully" });
  } catch (error) {
    next(error);
  }
});

// Delete a network (Admin & Operator)
router.delete("/:networkCode", authenticateUser([UserType.Admin, UserType.Operator]), async (req, res, next) => {
  try {
    await deleteNetwork(req.params.networkCode);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
