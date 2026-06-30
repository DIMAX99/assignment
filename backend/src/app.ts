import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import customerRoutes from "./modules/customer/customer.route.js";
import shipmentRoutes from "./modules/shipment/shipment.route.js";
import chatbotRoutes from "./modules/chatbot/chatbot.route.js";

const app = express();


app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));


app.use("/api/customers", customerRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});
// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
