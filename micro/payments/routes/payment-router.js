const express = require("express");
const PaymentCtrl = require("../controllers/payment-ctrl");
const {withAuth, withAPIAuth} = require("../middleware/authentication");
const router = express.Router();

router.post("/users/:user_id/payments", withAPIAuth, PaymentCtrl.postPayment);
router.post("/users/:user_id/payments/:payment_id/execute", withAuth, PaymentCtrl.executePayment);
router.get("/users/:user_id/payments", withAuth, PaymentCtrl.getPayments);
router.get("/users/:user_id/payments/:payment_id", withAuth, PaymentCtrl.getPayment);
router.post("/", PaymentCtrl.mqTest);
module.exports = router;