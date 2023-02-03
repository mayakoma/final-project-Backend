const express = require("express");
const orderController = require("../controllers/orders-controller");

const router = express.Router();
router.post("/add", orderController.addOrder);
router.patch("/update", orderController.updateOrder);
router.delete("/delete", orderController.deleteOrder);
router.get("/getOrders", orderController.getOrders);
router.post("/search", orderController.getOrersByFilters);
router.get("/getProductAmount", orderController.getOrdersByProducts);

module.exports = router;
