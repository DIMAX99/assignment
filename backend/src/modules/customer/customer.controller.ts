import type { Request, Response } from "express";
import { Logger } from "../../utils/logger.js";
import { CustomerService } from "./customer.service.js";

const service = new CustomerService();

export class CustomerController {

  async createCustomer(req: Request, res: Response) {
    try {
      Logger.info("Creating customer", req.body);
      const result = await service.createCustomer(req.body);
      Logger.info("Customer created successfully", result);
      return res.status(201).json({
        success: true,
        message: "Customer created successfully",
        data: result,
      });

    } catch (error) {
      Logger.error("Failed to create customer", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create customer",
      });
    }
  }

  async getCustomers(req: Request, res: Response) {
    try {
      Logger.info("Fetching customers List");
      const result = await service.getCustomers();
      Logger.info("Fetched customers List");
      return res.status(200).json({
        success: true,
        data: result,
      });

    } catch (error) {
      Logger.error("Failed to create customer", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch customers",
      });
    }
  }

  async updateCustomer(req: Request, res: Response) {
    try {
      Logger.info("Updating customers data");
      const id = Number(req.params.id);

      if (!id || isNaN(id)) {
        Logger.error("Failed to update customer : Invalid Customer ID");
        return res.status(400).json({
          success: false,
          message: "Invalid customer ID",
        });
      }
      const result = await service.updateCustomer(id, req.body);
      Logger.info("updated customers data");

      return res.status(200).json({
        success: true,
        message: "Customer updated successfully",
        data: result,
      });

    } catch (error) {
      Logger.error("Failed to update customer",error);
      return res.status(500).json({
        success: false,
        message: "Failed to update customer",
      });
    }
  }

  async deleteCustomer(req: Request, res: Response) {
    try {
      Logger.info("Deleting Customer",req.body);
      const id = Number(req.params.id);

      if (!id || isNaN(id)) {
        Logger.error("Invalid Customer ID");
        return res.status(400).json({
          success: false,
          message: "Invalid customer ID",
        });
      }

      const result = await service.deleteCustomer(id);
      Logger.info("Customer Deleted Successfully");
      return res.status(200).json({
        success: true,
        message: "Customer deleted successfully",
        data: result,
      });

    } catch (error) {
      Logger.error("Failed to delete customer",error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete customer",
      });
    }
  }
}