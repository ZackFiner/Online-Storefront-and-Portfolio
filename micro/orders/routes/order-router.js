const express = require("express");
const OrderCtrl = require("../controllers/order-ctrl");
const withAuth = require("../middleware/authentication");
const router = express.Router();

router.post("/users/:user_id/orders", withAuth, OrderCtrl.postOrder);
router.get("/users/:user_id/orders", withAuth, OrderCtrl.getOrders);
router.get("/users/:user_id/orders/:order_id", withAuth, OrderCtrl.getOrder);

module.exports = router;