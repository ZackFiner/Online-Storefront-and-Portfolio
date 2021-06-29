const express = require("express");
const InvCtrl = require("../controllers/inventory-ctrl");

const router = express.Router();

router.post("/", InvCtrl.createInvItem);
router.delete("/:id", InvCtrl.deleteInvItem);

module.exports = router;
