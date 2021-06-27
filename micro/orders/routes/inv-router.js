const express = require("express");
const InvCtrl = require("../controllers/inventory-ctrl");

const router = express.Router();

router.post("/", InvCtrl.createInvItem);

module.exports = router;
