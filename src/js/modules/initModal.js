import { Modal } from "../modules/modal.js";

export default () => {
	const modal = new Modal({
		isOpen: (modal) => {
			console.log("okay");
		},
		isClose: (modal) => {
			console.log("not-okay");
		},
	});
}
