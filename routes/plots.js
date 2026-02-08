const express = require("express");
const router = express.Router();

const {
	getPlots,
	getPlot,
	newPlot,
	updatePlot,
	deletePlot,
} = require("../controllers/plots");

router.route("/").get(getPlots).post(newPlot);
router.route("/:id").get(getPlot).patch(updatePlot).delete(deletePlot);

module.exports = router;
