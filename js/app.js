function removeClass(array, removedClass) {
	for (let el of array) {
		el.classList.remove(removedClass);
	}
}

// --- PHONE MASK ---
let phoneInputs = document.querySelectorAll('input[data-tel-input]');

for (let phoneInput of phoneInputs) {
	phoneInput.addEventListener('keydown', onPhoneKeyDown);
	phoneInput.addEventListener('input', onPhoneInput, false);
	phoneInput.addEventListener('paste', onPhonePaste, false);
}

function getInputNumbersValue(input) {
	// Return stripped input value — just numbers
	return input.value.replace(/\D/g, '');
}

function onPhonePaste(e) {
	let input = e.target,
		inputNumbersValue = getInputNumbersValue(input);
	let pasted = e.clipboardData || window.clipboardData;
	if (pasted) {
		let pastedText = pasted.getData('Text');
		if (/\D/g.test(pastedText)) {
			// Attempt to paste non-numeric symbol — remove all non-numeric symbols,
			// formatting will be in onPhoneInput handler
			input.value = inputNumbersValue;
			return;
		}
	}
}

function onPhoneInput(e) {
	let input = e.target,
		inputNumbersValue = getInputNumbersValue(input),
		selectionStart = input.selectionStart,
		formattedInputValue = '';

	if (!inputNumbersValue) {
		return (input.value = '');
	}

	if (input.value.length != selectionStart) {
		// Editing in the middle of input, not last symbol
		if (e.data && /\D/g.test(e.data)) {
			// Attempt to input non-numeric symbol
			input.value = inputNumbersValue;
		}
		return;
	}

	if (['7', '8', '9'].indexOf(inputNumbersValue[0]) > -1) {
		if (inputNumbersValue[0] == '9')
			inputNumbersValue = '7' + inputNumbersValue;
		let firstSymbols = inputNumbersValue[0] == '8' ? '8' : '+7';
		formattedInputValue = input.value = firstSymbols + ' ';
		if (inputNumbersValue.length > 1) {
			formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
		}
		if (inputNumbersValue.length >= 5) {
			formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
		}
		if (inputNumbersValue.length >= 8) {
			formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
		}
		if (inputNumbersValue.length >= 10) {
			formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
		}
	} else {
		formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
	}
	input.value = formattedInputValue;
}

function onPhoneKeyDown(e) {
	// Clear input after remove last symbol
	let inputValue = e.target.value.replace(/\D/g, '');
	if (e.keyCode == 8 && inputValue.length == 1) {
		e.target.value = '';
	}
}
// --- PHONE MASK ---

// --- POPUP ---
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');
let unlock = true;
const timeout = 800;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener('click', function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const currentPopup = document.getElementById(popupName);
			popupOpen(currentPopup);
			e.preventDefault();
		});
	}
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(currentPopup) {
	if (currentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		currentPopup.classList.add('open');
		currentPopup.addEventListener('click', function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnlock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue =
		window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnlock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});
// --- POPUP ---

// --- TABS ---
const tabsParents = document.querySelectorAll('[data-tabs]');

if (tabsParents.length) {
	for (let index = 0; index < tabsParents.length; index++) {
		const tabsParent = tabsParents[index];

		tabsInit(tabsParent);
	}
}

function tabsInit(tabsParent) {
	const tabs = Array.from(tabsParent.querySelectorAll('.tabs__tab'));
	const contents = tabsParent.querySelectorAll('.contents__content');

	for (let index = 0; index < tabs.length; index++) {
		const tab = tabs[index];

		tab.addEventListener('click', () => {
			const index = tabs.indexOf(tab);

			removeClass(tabs, 'active');
			removeClass(contents, 'active');

			tab.classList.add('active');
			contents[index].classList.add('active');
		});
	}
}
// --- TABS ---

// --- SELECT ---
const selects = document.querySelectorAll('.select');

if (selects.length > 0) {
	for (let index = 0; index < selects.length; index++) {
		const select = selects[index];
		const placeholder = select.querySelector('.select__placeholder');
		const btn = select.querySelector('.select__button');
		const list = select.querySelector('.select__list');
		const items = select.querySelectorAll('.select__list-item');
		const input = select.querySelector('input');

		btn.addEventListener('click', function () {
			btn.classList.toggle('select__button_clicked');
			list.classList.toggle('select__list_visible');
		});

		items.forEach(item => {
			item.addEventListener('click', function (event) {
				event.stopPropagation();

				placeholder.textContent = this.textContent;
				input.value = this.dataset.value;

				btn.classList.remove('select__button_clicked');
				list.classList.remove('select__list_visible');
			});
		});

		document.addEventListener('click', event => {
			if (event.target.closest('.select__button') !== btn) {
				btn.classList.remove('select__button_clicked');
				list.classList.remove('select__list_visible');
			}
		});
	}
}
// --- SELECT ---

// --- HEADER EVENTS ---
const header = document.querySelector('.header');
const headerBurger = header.querySelector('.header__burger');
const headerMenu = header.querySelector('.header__mobile');

if (headerBurger) {
	headerBurger.addEventListener('click', () => {
		headerBurger.classList.toggle('header__burger_active');
		headerMenu.classList.toggle('header__mobile_active');
	});
}
// --- HEADER EVENTS ---

// --- POPUP AUTH/REG EVENTS
const popupPasswordWrapper = document.querySelectorAll('.js-input-password');

if (popupPasswordWrapper.length) {
	for (let i = 0; i < popupPasswordWrapper.length; i++) {
		const passwordWrapper = popupPasswordWrapper[i];
		const passwordInput = passwordWrapper.querySelector('input');
		const passwordEye = passwordWrapper.querySelector(
			'.js-input-password__eye'
		);

		if (!passwordEye) continue;

		passwordEye.addEventListener('click', () => {
			const inputType = passwordInput.type === 'password' ? 'text' : 'password';

			passwordWrapper.classList.toggle('js-input-password_shown');
			passwordInput.type = inputType;
		});
	}
}
// --- POPUP AUTH EVENTS

window.onload = () => {
	// --- QUIZ
	const quiz = document.querySelector('.card-quiz');
	if (quiz) {
		const quizState = {
			link: {
				item: quiz.querySelector('.card-quiz__link'),
				active: true,
			},
			prev: {
				item: quiz.querySelector('.card-quiz__prev'),
				active: false,
			},
			next: {
				item: quiz.querySelector('.card-quiz__next'),
				active: true,
			},
			submit: {
				item: quiz.querySelector('.card-quiz__submit'),
				active: false,
			},
		};

		const quizSlider = new Swiper('.card-quiz__slider', {
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
			autoHeight: true,
			speed: 300,
			allowTouchMove: false,
			simulateTouch: false,
			navigation: {
				nextEl: '.card-quiz__next',
				prevEl: '.card-quiz__prev',
			},
			loop: false,
		});

		const renderStateChanges = () => {
			for (let key of Object.keys(quizState)) {
				quizState[key].active
					? (quizState[key].item.style.display = 'flex')
					: (quizState[key].item.style.display = 'none');
			}
		};

		quizSlider.on('slideChange', slider => {
			quizState.link.active = slider.isBeginning;
			quizState.prev.active = !slider.isBeginning;

			quizState.submit.active = slider.isEnd;
			quizState.next.active = !slider.isEnd;

			renderStateChanges();
		});
	}
	// --- QUIZ

	// --- Anchor Links ---
	const anchorLinks = document.querySelectorAll('.anchor-link');

	const currentUrl = window.location.href;
	const homeUrl = location.origin;

	if (currentUrl.includes('/#_')) {
		const href = currentUrl.substring(currentUrl.indexOf('/#_') + 3);
		scrollTo(href);
		history.pushState('', document.title, homeUrl);
	}

	for (let index = 0; index < anchorLinks.length; index++) {
		const link = anchorLinks[index];

		link.addEventListener('click', e => {
			let href = link.getAttribute('href');

			if (href.includes('#')) {
				e.preventDefault();
				href = href.replace('#', '');

				if (document.getElementById(href)) {
					scrollTo(href);
				} else {
					window.location.href = `${homeUrl}/#_${href}`;
				}
			}
		});
	}

	function scrollTo(href) {
		const scrollTarget = document.getElementById(href);
		const elementPosition = scrollTarget.getBoundingClientRect().top;
		let topOffset = header.clientHeight;

		const offsetPosition = elementPosition - topOffset;

		window.scrollBy({
			top: offsetPosition,
			behavior: 'smooth',
		});
	}
	// --- Anchor Links ---
};

// --- THUMBS ---
const thumbs = Array.from(document.querySelectorAll('.left-item__thumb'));

if (thumbs.length) {
	const mainImg = document.querySelector('.left-item__img');
	for (let i = 0; i < thumbs.length; i++) {
		const thumb = thumbs[i];

		thumb.addEventListener('mouseenter', () => thumbsHandler(thumb, mainImg));

		thumb.addEventListener('click', () => thumbsHandler(thumb, mainImg));
	}
}

function thumbsHandler(thumb, mainImg) {
	if (thumb.classList.contains('active')) return;
	const [activeThumb] = thumbs.filter(item =>
		item.classList.contains('active')
	);

	mainImg.classList.add('hidden');

	activeThumb.classList.remove('active');
	thumb.classList.add('active');

	const newSrc = thumb.src.replace('_small', '');
	setTimeout(() => {
		mainImg.src = newSrc;
		mainImg.onload = () => mainImg.classList.remove('hidden');
	}, 400);
}
// --- THUMBS ---
