import { CONFIG } from "@config";
import { createMeasurement, getMeasurementsBySensor, getMeasurementsBySensorSet, getOutliersBySensor, getOutliersBySensorSet, getStatsBySensor, getStatsBySensorSet } from "@controllers/measurementController";
import { authenticateUser } from "@middlewares/authMiddleware";
import { UserType } from "@models/UserType";
import { parseISODateParamToUTC, parseStringArrayParam } from "@utils";
import { Router } from "express";

const router = Router();

// Store a measurement for a sensor (Admin & Operator)
router.post(
  CONFIG.ROUTES.V1_SENSORS + "/:sensorMac/measurements", 
  authenticateUser([UserType.Admin, UserType.Operator]),
  async (req, res, next) => {
    try {
      for (const measure of req.body) {
        await createMeasurement(
          req.params.networkCode,
          req.params.gatewayMac,
          req.params.sensorMac,
          measure
        );
      }
      res.status(201).send();
    } 
    catch (error) {
      next(error);
    }
  }
);

// Retrieve measurements for a specific sensor
router.get(
  CONFIG.ROUTES.V1_SENSORS + "/:sensorMac/measurements",
  authenticateUser([UserType.Admin, UserType.Operator, UserType.Viewer]),
  async (req, res, next) => {
    try {
      res.status(200).json(
        await getMeasurementsBySensor(
          req.params.networkCode,
          req.params.gatewayMac,
          req.params.sensorMac,
          parseISODateParamToUTC(req.query.startDate),
          parseISODateParamToUTC(req.query.endDate)
        )
      );
    }
    catch (error) {
      next(error);
    }
  }
);

// Retrieve statistics for a specific sensor
router.get(CONFIG.ROUTES.V1_SENSORS + "/:sensorMac/stats",
  authenticateUser([UserType.Admin, UserType.Operator, UserType.Viewer]),
  async (req, res, next) => {
    try {
      res.status(200).json(
        await getStatsBySensor(
          req.params.networkCode,
          req.params.gatewayMac,
          req.params.sensorMac,
          parseISODateParamToUTC(req.query.startDate),
          parseISODateParamToUTC(req.query.endDate)
        )
      );
    }
    catch (error) {
      next(error);
    }
  }
);

// Retrieve only outliers for a specific sensor
router.get(
  CONFIG.ROUTES.V1_SENSORS + "/:sensorMac/outliers",
  authenticateUser([UserType.Admin, UserType.Operator, UserType.Viewer]),
  async (req, res, next) => {
    try {
      res.status(200).json(
        await getOutliersBySensor(
          req.params.networkCode,
          req.params.gatewayMac,
          req.params.sensorMac,
          parseISODateParamToUTC(req.query.startDate),
          parseISODateParamToUTC(req.query.endDate)
        )
      );
    }
    catch (error) {
      next(error);
    }
  }
);

// Retrieve measurements for a set of sensors of a specific network
router.get(
  CONFIG.ROUTES.V1_NETWORKS + "/:networkCode/measurements",
  authenticateUser([UserType.Admin, UserType.Operator, UserType.Viewer]),
  async (req, res, next) => {
    try {
      res.status(200).json(
        await getMeasurementsBySensorSet(
          req.params.networkCode,
          parseStringArrayParam(req.query.sensorMacs),
          parseISODateParamToUTC(req.query.startDate),
          parseISODateParamToUTC(req.query.endDate)
        )
      );
    }
    catch (error) {
      next(error);
    }
  }
);

router.get(
  CONFIG.ROUTES.V1_NETWORKS + "/:networkCode/stats",
  authenticateUser([UserType.Admin, UserType.Operator, UserType.Viewer]),
  async (req, res, next) => {
    try {
      res.status(200).json(
        await getStatsBySensorSet(
          req.params.networkCode,
          parseStringArrayParam(req.query.sensorMacs),
          parseISODateParamToUTC(req.query.startDate),
          parseISODateParamToUTC(req.query.endDate)
        )
      );
    }
    catch (error) {
      next(error);
    }
  }
);

router.get(
  CONFIG.ROUTES.V1_NETWORKS + "/:networkCode/outliers",
  authenticateUser([UserType.Admin, UserType.Operator, UserType.Viewer]),
  async (req, res, next) => {
    try {
      res.status(200).json(
        await getOutliersBySensorSet(
          req.params.networkCode,
          parseStringArrayParam(req.query.sensorMacs),
          parseISODateParamToUTC(req.query.startDate),
          parseISODateParamToUTC(req.query.endDate)
        )
      );
    }
    catch (error) {
      next(error);
    }
  }
);

export default router;
