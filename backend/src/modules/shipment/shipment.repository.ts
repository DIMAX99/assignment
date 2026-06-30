import { prisma } from "../../config/prisma.js"

export class ShipmentRepository {
  create(data: any) {
    return prisma.shipment.create({ data });
  }

  findAll() {
    return prisma.shipment.findMany({
      include: {
        customer: true,
      },
    });
  }

  findById(id: number) {
    return prisma.shipment.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    });
  }

  updateStatus(id: number, status: any) {
    return prisma.shipment.update({
      where: { id },
      data: { status },
    });
  }
}