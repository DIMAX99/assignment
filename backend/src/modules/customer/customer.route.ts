import express from "express";
import { CustomerController } from "./customer.controller.js";

const router = express.Router();
const controller = new CustomerController();

/**
 * @openapi
 * /api/customers:
 *   post:
 *     tags:
 *       - Customers
 *     summary: Create a customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               company:
 *                 type: string
 *                 example: Acme Inc
 *               status:
 *                 type: string
 *                 enum:
 *                   - ACTIVE
 *                   - INACTIVE
 *                 example: ACTIVE
 *     responses:
 *       201:
 *         description: Customer created successfully
 */
router.post("/", controller.createCustomer);

/**
 * @openapi
 * /api/customers:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Get all customers
 *     responses:
 *       200:
 *         description: A list of customers
 */
router.get("/", controller.getCustomers);

/**
 * @openapi
 * /api/customers/{id}:
 *   put:
 *     tags:
 *       - Customers
 *     summary: Update a customer
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               company:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - ACTIVE
 *                   - INACTIVE
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Invalid customer ID
 */
router.put("/:id", controller.updateCustomer);

/**
 * @openapi
 * /api/customers/{id}:
 *   delete:
 *     tags:
 *       - Customers
 *     summary: Soft delete a customer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       400:
 *         description: Invalid customer ID
 */
router.delete("/:id", controller.deleteCustomer);

export default router;