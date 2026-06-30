import { prisma } from "../../config/prisma.js"

export class CustomerRepository {
  create(data: any) {
    return prisma.customer.create({ data });
  }

  findAll() {
    return prisma.customer.findMany();
  }

  update(id: number, data: any) {
    return prisma.customer.update({
      where: { id },
      data
    });
  }

  softDelete(id: number) {
    return prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date(),status: "INACTIVE" },
    });
  }
}