const express = require("express");
const { dashboard, update } = require("../controllers/newsController");
const { verifyJwtToken } = require("../controllers/authController");

const router = express.Router();

router.use(verifyJwtToken);
router.get("/", dashboard);
router.patch("/:id", update);

module.exports = router;
