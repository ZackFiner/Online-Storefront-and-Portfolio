const express = require("express");
const OrderCtrl = require("../controllers/order-ctrl");

const router = express.Router();

router.post("/users/:user_id/orders", OrderCtrl.postOrder);
router.get("/users/:user_id/orders", OrderCtrl.getOrders);
router.get("/users/:user_id/orders/:order_id", OrderCtrl.getOrder);

module.exports = router;