const express = require("express");
const productsController = require("../controllers/products-controllers");

const router = express.Router();

router.get("/getProducts", productsController.getProducts);

router.post("/add", productsController.addProduct);

router.post("/update", productsController.updateProduct);

router.post("/delete", productsController.deleteProduct);

module.exports = router;
