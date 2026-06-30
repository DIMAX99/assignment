import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import customerRoutes from "./modules/customer/customer.route.js";
import shipmentRoutes from "./modules/shipment/shipment.route.js";

const app = express();

app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/shipments", shipmentRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});
// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;