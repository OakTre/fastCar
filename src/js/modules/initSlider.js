import { Navigation, Swiper, EffectFade } from 'swiper';
import { sendRequest } from "../modules/sendRequest";
import { LikeBtns } from "../modules/LikeBtns";

Swiper.use([Navigation, EffectFade]);

export default () => {
	const startUrl = "https://private-anon-b88cb4687f-grchhtml.apiary-mock.com/slides?offset=0&limit=3";
	const introSliderEl = document.querySelector(".intro-slider");
	const swiperWrapper = document.querySelector(".js-swiper-warpper");

	// инициализируем слайдер
	let sliderIntro = new Swiper(introSliderEl, {
		slidesPerView: 1,
		spaceBetween: 0,
		allowTouchMove: false,
		infinte: false,
		navigation: {
			nextEl: '.js-intro-slider-nav-next',
			prevEl: '.js-intro-slider-nav-prev',
		},
	});

	// отправляем запрос для получения 3-х слайдов
	sendRequest("GET", startUrl)
		.then((resp) => {
			let data = resp.data;

			for (let i = 0; i < data.length; i++) {
				// заглушка для изображений если не пришли
				let isErroImg = data[i].imgUrl ? data[i].imgUrl : "img/error-img.svg";

				let overlay = `
					<div class="swiper-slide site-container intro-slider__item" style="background-image: url(${isErroImg})">
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
				`;

				// подставляем полученные данные
				swiperWrapper.innerHTML += overlay;
			}
		})
		.then((resp) => {
			// затем обновляем слайдер с новыми данными
			sliderIntro.update();
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
		// знаем что слайдов 7, чтобы не повторялись данные добавил условие
		if(swiper.slides.length == 7) return;

		let offsetUrl = `https://private-anon-b88cb4687f-grchhtml.apiary-mock.com/slides?offset=${swiper.slides.length}&limit=3`

		sendRequest("GET", offsetUrl)
			.then((resp)=>{
				let data = resp.data;

				for (let i = 0; i < data.length; i++) {
					// заглушка для изображений если не пришли
					let isErroImg = data[i].imgUrl ? data[i].imgUrl : "img/error-img.svg";

					let overlay = `
						<div class="swiper-slide site-container intro-slider__item" style="background-image: url(${isErroImg})">
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
					`;

					// подставляем полученные данные
					swiperWrapper.innerHTML += overlay;
				}
			})
			.then((resp) => {
				// затем обновляем слайдер с новыми данными
				sliderIntro.update();
			})
			.then((resp)=>{
				LikeBtns();
			})
			.catch((err) => {
				console.log("ended");
			});
	});
};
