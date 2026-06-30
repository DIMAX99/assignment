import express from "express";
import { ShipmentController } from "./shipment.controller.js";

const router = express.Router();
const controller = new ShipmentController();

/**
 * @openapi
 * /api/shipments:
 *   post:
 *     tags:
 *       - Shipments
 *     summary: Create a shipment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trackingNumber
 *               - origin
 *               - destination
 *             properties:
 *               trackingNumber:
 *                 type: string
 *                 example: TRK-10001
 *               customerId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               origin:
 *                 type: string
 *                 example: New York
 *               destination:
 *                 type: string
 *                 example: Boston
 *               status:
 *                 type: string
 *                 enum:
 *                   - ARRIVED
 *                   - DELAYED
 *                   - SHIPPED
 *                   - PROCESSING
 *                 example: PROCESSING
 *     responses:
 *       201:
 *         description: Shipment created successfully
 */
router.post("/", controller.createShipment);

/**
 * @openapi
 * /api/shipments:
 *   get:
 *     tags:
 *       - Shipments
 *     summary: Get all shipments
 *     responses:
 *       200:
 *         description: A list of shipments
 */
router.get("/", controller.getAllShipments);

/**
 * @openapi
 * /api/shipments/{id}:
 *   get:
 *     tags:
 *       - Shipments
 *     summary: Get a shipment by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Shipment found
 *       404:
 *         description: Shipment not found
 */
router.put("/:id", controller.getShipment);

/**
 * @openapi
 * /api/shipments/{id}/status:
 *   put:
 *     tags:
 *       - Shipments
 *     summary: Update shipment status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - ARRIVED
 *                   - DELAYED
 *                   - SHIPPED
 *                   - PROCESSING
 *                 example: SHIPPED
 *     responses:
 *       200:
 *         description: Shipment status updated successfully
 *       500:
 *         description: Invalid shipment status
 */
router.put("/:id/status", controller.updateStatus);

export default router;