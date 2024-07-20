const router = require("express").Router();
const viewsRoutes = require("./views")

router.use("/", viewsRoutes);

module.exports = router;