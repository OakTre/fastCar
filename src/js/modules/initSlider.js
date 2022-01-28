import { Navigation, Swiper, EffectFade } from 'swiper';
import { sendRequest } from "../modules/sendRequest";
import { Modal } from "../modules/modal.js";

Swiper.use([Navigation, EffectFade]);

export default () => {
	const startUrl = "https://private-anon-b88cb4687f-grchhtml.apiary-mock.com/slides?offset=0&limit=3";
	const likeUrl = "https://private-anon-b88cb4687f-grchhtml.apiary-mock.com/slides/0/like";
	const introSliderEl = document.querySelector(".intro-slider");
	const modal = new Modal();

	let sliderIntro = new Swiper(introSliderEl, {
		slidesPerView: 1,
        spaceBetween: 10,
		allowTouchMove: false,
		infinte: false,
		effect: 'fade',
		fadeEffect: {
		  crossFade: true
		},
		navigation: {
			nextEl: '.js-intro-slider-nav-next',
			prevEl: '.js-intro-slider-nav-prev',
		},
	});

	sendRequest("GET", startUrl)
		.then((resp)=>{
			let data = resp.data;
			const swiperWrapper = document.querySelector(".js-swiper-warpper");

			for (let i = 0; i < data.length; i++) {
				let isErroImg = data[i].imgUrl ? data[i].imgUrl : "img/error-img.svg";

				let overlay = `
					<div class="swiper-slide site-container intro-slider__item" style="background-image: url(${isErroImg})">
						<div class="intro-slider__item-top">
							<h2 class="intro-slider__item-heading">${data[i].title}</h2>
						</div>
						<div class="intro-slider__item-bottom">
							<p class="intro-slider__item-text">${data[i].desc}</p>
							<div class="intro-slider__likes">
								<button class="button-reset intro-slider__likes-btn js-like-btn">
									<svg class="icon icon-like intro-slider__likes-btn-icon" width="38" height="36">
										<use xlink:href="img/sprite.svg#like"></use>
									</svg>
								</button><span class="intro-slider__likes-count">like:<span class="intro-slider__likes-count-num"> ${data[i].likeCnt}</span></span>
							</div>
						</div>
					</div>
				`;

				swiperWrapper.innerHTML += overlay;
			}
		})
		.then((resp) => {
			sliderIntro.update();
		})
		.then((resp) => {
			const likeBtns = document.querySelectorAll(".js-like-btn");

			likeBtns.forEach(btn => {
				btn.addEventListener("click", ()=>{
					sendRequest("POST", likeUrl)
						.then((resp)=>{
							document.querySelector(".js-like-heading").innerHTML = resp.title;
							document.querySelector(".js-like-descr").innerHTML = resp.desc;

							modal.onOpen("like");
						})
						.catch((resp)=>{
							document.querySelector(".js-like-heading").innerHTML = "Что-то пошло не так";
							document.querySelector(".js-like-descr").innerHTML = "Попробуйте отправить снова, только чуть-чуть позже:)";

							modal.onOpen("like");
						});
				});
			});
		})
		.catch((err)=>{

		});
};
