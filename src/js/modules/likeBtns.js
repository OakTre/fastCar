import { sendRequest } from "../modules/sendRequest";
import { Modal } from "../modules/modal";

export function LikeBtns() {
	// находим кнопки лайка
	const likeBtns = document.querySelectorAll(".js-like-btn");
	const modal = new Modal();

	// ставим лайк и отправляем запрос для получения текста в модалку
	likeBtns.forEach(btn => {
		btn.addEventListener("click", () => {
			btn.classList.add("is-active");
			let slideId =  btn.dataset.slideId;
			console.log(slideId);
			let likeUrl = `https://private-anon-b88cb4687f-grchhtml.apiary-mock.com/slides/${slideId}/like`;
			let likesCount = Number(btn.dataset.likes);
			likesCount += 1;
			btn.closest(".intro-slider__likes").querySelector(".intro-slider__likes-count-num").innerHTML = " " + likesCount;

			sendRequest("POST", likeUrl)
				.then((resp) => {
					document.querySelector(".js-like-heading").innerHTML = resp.title;
					document.querySelector(".js-like-descr").innerHTML = resp.desc;

					// открываем модалку
					modal.onOpen("like", "fadeInUp");
				})
				.catch((resp) => {
					// обрабатываем ошибки
					document.querySelector(".js-like-heading").innerHTML = "Что-то пошло не так";
					document.querySelector(".js-like-descr").innerHTML = "Попробуйте отправить снова, только чуть-чуть позже:)";

					// если ошибка то убираем лайк и ставим дефолтные значения
					btn.classList.remove("is-active");
					btn.closest(".intro-slider__likes").querySelector(".intro-slider__likes-count-num").innerHTML = " " + btn.dataset.likes;

					// открываем модалку
					modal.onOpen("like", "fadeInUp");
				});
		});
	});
}
