import documentReady from "./helpers/documentReady";
import lazyImages from "./modules/lazyImages";
import initSlider from "./modules/initSlider";
import initModal from "./modules/initModal";
import initLikeModal from "./modules/initLikeModal";

window.onload = function() {
	const preloader = document.querySelector(".preloader");

	setTimeout(() => {
		preloader.classList.add("_is-loaded");
	}, 150);

	setTimeout(() => {
		preloader.style.display = "none";
	}, 400);
};

documentReady(() => {
	lazyImages();
	initSlider();
	initModal();
	initLikeModal();
});
