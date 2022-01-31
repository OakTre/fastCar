import { Navigation, Swiper } from 'swiper';
import { sendRequest } from "../modules/sendRequest";
import { LikeBtns } from "../modules/LikeBtns";

Swiper.use([Navigation]);

export default () => {
	const startUrl = "https://private-anon-b88cb4687f-grchhtml.apiary-mock.com/slides?offset=0&limit=3";
	const introSliderEl = document.querySelector(".intro-slider");
	const swiperWrapper = document.querySelector(".js-swiper-warpper");
	let interleaveOffset = 0.7;

	// функция для подстановки в соц. href ссылок для репоста
	function setShareLinks(curSlide) {
		let img = curSlide.dataset.img;
		let title = curSlide.dataset.title;
		let href = document.location.href;
		let fbLink = document.querySelector(".js-social-fb");
		let vkLink = document.querySelector(".js-social-vk");
		let okLink = document.querySelector(".js-social-ok");

		let okShare = `http://connect.mail.ru/share?url=${href}&title=${title}&imageurl=${img}`;
		let vkShare = `http://vk.com/share.php?url=${href}&title=${title}&image=${img}`;
		let fbShare = `https://www.facebook.com/sharer/sharer.php?u=${href}&${title}`;

		fbLink.setAttribute("href", fbShare);
		vkLink.setAttribute("href", vkShare);
		okLink.setAttribute("href", okShare);
	};

	function setLikes() {
		if (localStorage.getItem("likes")) {
			let likesData = JSON.parse(localStorage.getItem('likes'));
			let btns = document.querySelectorAll(".js-like-btn");

			for (let item of likesData) {
				btns.forEach(btn => {
					if (Number(btn.dataset.slideId) == item.id) {
						btn.closest(".intro-slider__likes").querySelector(".intro-slider__likes-count-num").innerHTML = " " + item.count;
						btn.classList.add("is-active");
					}
				});
			}
		}
	};

	// инициализируем слайдер
	let sliderIntro = new Swiper(introSliderEl, {
		watchSlidesProgress: true,
		allowTouchMove: false,
		loop: false,
		speed: 1000,
		navigation: {
			nextEl: '.js-intro-slider-nav-next',
			prevEl: '.js-intro-slider-nav-prev',
		},
		on: {
			progress: function (swiper) {
				for (let i = 0; i < swiper.slides.length; i++) {
					let slideProgress = swiper.slides[i].progress;
					let innerOffset = swiper.width * interleaveOffset;
					let innerTranslate = slideProgress * innerOffset;
					swiper.slides[i].querySelector(".intro-slider__item-layer").style.transform =
						"translate3d(" + innerTranslate + "px, 0, 0)";
				}
			},
			setTransition: function (swiper, speed) {
				for (let i = 0; i < swiper.slides.length; i++) {
					swiper.slides[i].style.transition = speed + "ms";
					swiper.slides[i].querySelector(".intro-slider__item-layer").style.transition =
						speed + "ms";
				}
			},
			slideChange: function (swiper) {
				const indexCurrentSlide = swiper.realIndex;
				const currentSlide = swiper.slides[indexCurrentSlide]
				setShareLinks(currentSlide);
			},
		}
	});

	// отправляем запрос для получения 3-х слайдов
	sendRequest("GET", startUrl)
		.then((resp) => {
			let data = resp.data;

			for (let i = 0; i < data.length; i++) {
				// заглушка для изображений если не пришли
				let isErroImg = data[i].imgUrl ? data[i].imgUrl : "img/error-img.svg";

				let overlay = `
					<div class="swiper-slide site-container intro-slider__item" data-img="${isErroImg}" data-title="${data[i].title}">
						<div class="intro-slider__item-layer" style="background-image: url(${isErroImg})"></div>
						<div class="intro-slider__item-wrapper">
							<div class="intro-slider__item-top">
								<h2 class="intro-slider__item-heading">${data[i].title}</h2>
							</div>
							<div class="intro-slider__item-bottom">
								<p class="intro-slider__item-text">${data[i].desc}</p>
								<div class="intro-slider__likes">
									<button class="button-reset intro-slider__likes-btn js-like-btn" data-likes="${data[i].likeCnt}" data-slide-id="${data[i].id}">
										<svg class="icon icon-like intro-slider__likes-btn-icon" width="38" height="36">
											<use xlink:href="img/sprite.svg#like"></use>
										</svg>
									</button><span class="intro-slider__likes-count">like:<span class="intro-slider__likes-count-num"> ${data[i].likeCnt}</span></span>
								</div>
							</div>
						</div>
					</div>
				`;

				// подставляем полученные данные
				swiperWrapper.innerHTML += overlay;
			}
		})
		.then((resp) => {
			// затем обновляем слайдер с новыми данными
			sliderIntro.update();

			// подставляем ссылки щеринга для первого слайда
			let currentSlide = document.querySelector(".intro-slider__item.swiper-slide-active");
			setShareLinks(currentSlide);

			// подставляем данные из localstorage
			setLikes();
		})
		.then((resp) => {
			// Обрабатываем лайки
			LikeBtns();
		})
		.catch((err) => {
			// обрабатываем ошибку запроса
		});

	// отправляем запрос в бд для новых слайдов
	sliderIntro.on('reachEnd', function (swiper) {
		// знаю что слайдов 7 на данный момент, чтобы не повторялись данные добавил условие
		if (swiper.slides.length == 7) return;

		let offsetUrl = `https://private-anon-b88cb4687f-grchhtml.apiary-mock.com/slides?offset=${swiper.slides.length}&limit=3`

		sendRequest("GET", offsetUrl)
			.then((resp) => {
				let data = resp.data;

				for (let i = 0; i < data.length; i++) {
					// заглушка для изображений если не пришли
					let isErroImg = data[i].imgUrl ? data[i].imgUrl : "img/error-img.svg";

					let overlay = `
						<div class="swiper-slide site-container intro-slider__item" data-img="${isErroImg}" data-title="${data[i].title}">
							<div class="intro-slider__item-layer" style="background-image: url(${isErroImg})"></div>
							<div class="intro-slider__item-wrapper">
								<div class="intro-slider__item-top">
									<h2 class="intro-slider__item-heading">${data[i].title}</h2>
								</div>
								<div class="intro-slider__item-bottom">
									<p class="intro-slider__item-text">${data[i].desc}</p>
									<div class="intro-slider__likes">
										<button class="button-reset intro-slider__likes-btn js-like-btn" data-likes="${data[i].likeCnt}" data-slide-id="${data[i].id}">
											<svg class="icon icon-like intro-slider__likes-btn-icon" width="38" height="36">
												<use xlink:href="img/sprite.svg#like"></use>
											</svg>
										</button><span class="intro-slider__likes-count">like:<span class="intro-slider__likes-count-num"> ${data[i].likeCnt}</span></span>
									</div>
								</div>
							</div>
						</div>
					`;

					// подставляем полученные данные
					swiperWrapper.innerHTML += overlay;
				}
			})
			.then((resp) => {
				// затем обновляем слайдер с новыми данными
				sliderIntro.update();

				// подставляем данные из localstorage
				setLikes();
			})
			.then((resp) => {
				// Обрабатываем лайки
				LikeBtns();
			})
			.catch((err) => {
				// обрабатываем ошибку запроса

			});
	});
};
