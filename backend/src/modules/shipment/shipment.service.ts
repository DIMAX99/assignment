import { ShipmentRepository } from "./shipment.repository.js";

const repo = new ShipmentRepository();

export class ShipmentService {
  createShipment(data: any) {
    return repo.create(data);
  }

  getAllShipments() {
    return repo.findAll();
  }

  getShipment(id: number) {
    return repo.findById(id);
  }

  updateStatus(id: number,status:any) {
    const allowed = ["ARRIVED", "DELAYED", "SHIPPED", "PROCESSING"];

    if (!allowed.includes(status)) {
        throw new Error("Invalid shipment status");
    }
    return repo.updateStatus(id,status);
  }
}