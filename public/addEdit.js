import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showPlots } from "./plots.js";

let addEditDiv = null;
let unitType = null;
let addingPlot = null;

export const handleAddEdit = () => {
	addEditDiv = document.getElementById("edit-plot");
	unitType = document.getElementById("unitType");
	addingPlot = document.getElementById("adding-plot");
	const editCancel = document.getElementById("edit-cancel");

	addEditDiv.addEventListener("click", async (e) => {
		if (inputEnabled && e.target.nodeName === "BUTTON") {
			if (e.target === addingPlot) {
				enableInput(false);

				let method = "POST";
				let url = "/api/v1/plots";

				if (addingPlot.textContent === "update") {
					method = "PATCH";
					url = `/api/v1/plots/${addEditDiv.dataset.id}`;
				}

				try {
					const response = await fetch(url, {
						method: method,
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							unitType: unitType.value,
						}),
					});

					const data = await response.json();
					if (response.status === 200 || response.status === 201) {
						if (response.status === 200) {
							// a 200 is expected for a successful update
							message.textContent = "The plot entry was updated.";
						} else {
							// a 201 is expected for a successful create
							message.textContent = "The plot entry was created.";
						}

						unitType.value = "";
						showPlots();
					} else {
						message.textContent = data.msg;
					}
				} catch (err) {
					console.log(err);
					message.textContent = "A communication error occurred.";
				}

				enableInput(true);
			} else if (e.target === editCancel) {
				message.textContent = "";
				showPlots();
			}
		}
	});
};

export const showAddEdit = async (plotId) => {
	if (!plotId) {
		unitType.value = "";
		addingPlot.textContent = "add";
		message.textContent = "";

		setDiv(addEditDiv);
	} else {
		enableInput(false);

		try {
			const response = await fetch(`/api/v1/plots/${plotId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await response.json();
			if (response.status === 200) {
				unitType.value = data.plot.unitType;
				addingPlot.textContent = "update";
				message.textContent = "";
				addEditDiv.dataset.id = plotId;

				setDiv(addEditDiv);
			} else {
				// might happen if the list has been updated since last display
				message.textContent = "The plot entry was not found";
				showPlots();
			}
		} catch (err) {
			console.log(err);
			message.textContent = "A communications error has occurred.";
			showPlots();
		}

		enableInput(true);
	}
};
