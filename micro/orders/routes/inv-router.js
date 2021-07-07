const express = require("express");
const InvCtrl = require("../controllers/inventory-ctrl");
const {withAPIAuth} = require("../middleware/authentication");
const router = express.Router();

router.post("/", withAPIAuth, InvCtrl.createInvItem);
router.delete("/:id", withAPIAuth, InvCtrl.deleteInvItem);

module.exports = router;
