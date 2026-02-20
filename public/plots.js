import {
	inputEnabled,
	setDiv,
	message,
	setToken,
	token,
	enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let plotsDiv = null;
let plotsTable = null;
let plotsTableHeader = null;

export const handlePlots = () => {
	plotsDiv = document.getElementById("plots");
	const logoff = document.getElementById("logoff");
	const addPlot = document.getElementById("add-plot");
	plotsTable = document.getElementById("plots-table");
	plotsTableHeader = document.getElementById("plots-table-header");

	plotsDiv.addEventListener("click", (e) => {
		if (inputEnabled && e.target.nodeName === "BUTTON") {
			if (e.target === addPlot) {
				showAddEdit(null);
			} else if (e.target === logoff) {
				setToken(null);

				message.textContent = "You have been logged off.";

				plotsTable.replaceChildren([plotsTableHeader]);

				showLoginRegister();
			} else if (e.target.classList.contains("editButton")) {
				message.textContent = "";
				showAddEdit(e.target.dataset.id);
			} else if (e.target.classList.contains("deleteButton")) {
				message.textContent = "";
				deletePlot(e.target.dataset.id);
			}
		}
	});
};

const deletePlot = async (plotId) => {
	enableInput(false);

	if (!plotId) {
		message.textContent = "An error occurred. No plot ID provided.";
	} else {
		try {
			const response = await fetch(`/api/v1/plots/${plotId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await response.json();
			if (response.status === 200) {
				message.textContent = "The plot entry was deleted.";
				showPlots();
			} else {
				message.textContent = "The plot entry was not found";
			}
		} catch (err) {
			console.log(err);
			message.textContent = "A communication error occurred.";
		}
	}
	enableInput(true);
};

export const showPlots = async () => {
	try {
		enableInput(false);

		const response = await fetch("/api/v1/plots", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		const data = await response.json();
		let children = [plotsTableHeader];

		if (response.status === 200) {
			if (data.count === 0) {
				plotsTable.replaceChildren(...children); // clear this for safety
			} else {
				for (let i = 0; i < data.plots.length; i++) {
					let rowEntry = document.createElement("tr");

					let editButton = `<td><button type="button" class="editButton" data-id=${data.plots[i]._id}>edit</button></td>`;
					let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.plots[i]._id}>delete</button></td>`;

					let rowHTML = `
            <td>${data.plots[i].unitType}</td>
            <div>${editButton}${deleteButton}</div>`;

					rowEntry.innerHTML = rowHTML;
					children.push(rowEntry);
				}
				plotsTable.replaceChildren(...children);
			}
		} else {
			message.textContent = data.msg;
		}
	} catch (err) {
		console.log(err);
		message.textContent = "A communication error occurred.";
	}
	enableInput(true);
	setDiv(plotsDiv);
};
