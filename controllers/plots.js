const Plot = require("../models/Plot");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getPlots = async (req, res) => {
	const plots = await Plot.find({ userId: req.user.userId }).sort(
		"createdAt",
	);
	res.status(StatusCodes.OK).json({ plotCount: plots.length, plots });
};

const getPlot = async (req, res) => {
	const {
		user: { userId },
		params: { id: plotId },
	} = req;

	const plot = await Plot.findOne({
		_id: plotId,
		userId: userId,
	});
	if (!plot) {
		throw new NotFoundError(`No plot with id ${plotId}`);
	}
	res.status(StatusCodes.OK).json({ plot });
};

const newPlot = async (req, res) => {
	req.body.userId = req.user.userId;
	const plot = await Plot.create(req.body);

	res.status(StatusCodes.CREATED).json(plot);
};

const updatePlot = async (req, res) => {
	const {
		user: { userId },
		params: { id: plotId },
		body: { unitType },
	} = req;

	if (unitType === "") {
		throw new BadRequestError("Unit type field cannot be empty");
	}

	const updatedPlot = await Plot.findByIdAndUpdate(
		{ _id: plotId, userId: userId },
		req.body,
		{ new: true, runValidators: true },
	);
	if (!updatedPlot) {
		throw new NotFoundError(`No plot with id ${plotId}`);
	}
	res.status(StatusCodes.OK).json({ updatedPlot });
};

const deletePlot = async (req, res) => {
	const {
		user: { userId },
		params: { id: plotId },
	} = req;

	const plot = await Plot.findByIdAndDelete({ _id: plotId, userId: userId });
	if (!plot) {
		throw new NotFoundError(`No plot with id ${plotId}`);
	}

	res.status(StatusCodes.OK).json({ msg: "The plot entry was deleted." });
};

module.exports = {
	getPlots,
	getPlot,
	newPlot,
	updatePlot,
	deletePlot,
};
