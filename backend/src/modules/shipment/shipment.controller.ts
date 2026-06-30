import type { Request, Response } from "express";
import { ShipmentService } from "./shipment.service.js";

const service = new ShipmentService();

export class ShipmentController {

  async createShipment(req: Request, res: Response) {
    try {
      const trackingNumber = `TRK${Date.now()}${Math.floor(Math.random() * 10000)}`;
      const data = {
        ...req.body,
        trackingNumber
      };
      const result = await service.createShipment(data);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to create shipment" });
    }
  }

  async getAllShipments(req: Request, res: Response) {
    try {
      const result = await service.getAllShipments();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch shipments" });
    }
  }

  async getShipment(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await service.getShipment(id);

      if (!result) {
        return res.status(404).json({ message: "Shipment not found" });
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Error fetching shipment" });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      const result = await service.updateStatus(id, status);

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to update status" });
    }
  }
}