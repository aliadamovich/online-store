export function changeFilters() {

	const blockCategory = document.querySelectorAll('.categories-filter__item');
	const hideFilters = document.querySelector('.hide-filter__btn');

	const categoryContainer = document.querySelector('.categories-filter');
	const categoryChosen = document.querySelector('.grid-filter__choice');

	//тоггл класса по нажатию на плюсик категории
	if (blockCategory.length > 0) {

		blockCategory.forEach(item => {
			item.addEventListener('click', (e) => {
				if (e.target.closest('.categories-filter__head')) {
					item.classList.toggle('open');
				}
			})
		})
	}

	//скрывание всех категорий по нажатию на кнопку hide filters
	if (hideFilters) {
		hideFilters.addEventListener('click', clearAll)
	}

	//изменение размера грид-сетки по нажатию на кнопку (2, 3, 4)

	const gridButtons = document.querySelector('.sort-grid__numbers');
	const filterProducts = document.querySelector('.grid-filter__products');

	if (gridButtons) {
		gridButtons.addEventListener('click', function (e) {

			const targetButton = e.target.closest('.sort-grid__btn');
			const buttons = document.querySelectorAll('.sort-grid__btn');
			buttons.forEach(button => {
				button.classList.remove('sort-grid__btn--current', 'nav__link--current')
			})
			if (targetButton) {
				targetButton.classList.add('sort-grid__btn--current', 'nav__link--current');
				let dataBtn = targetButton.dataset.gridbtn;
				filterProducts.dataset.gridcolumns = dataBtn;
			}
			e.preventDefault();
		})
	}

	const catalogWrapper = document.querySelector('.catalog-wrapper');

	if (catalogWrapper) {
		window.addEventListener('resize', resizeGallery);

		function resizeGallery(e) {
			if (window.innerWidth <= 768 && window.innerWidth > 500) {
				filterProducts.dataset.gridcolumns = 3;
			} else if (window.innerWidth <= 500) {
				filterProducts.dataset.gridcolumns = 2;
			}
			else {
				const currentButtn = Array.from(gridButtons.querySelectorAll('.sort-grid__btn')).find(item =>
					item.classList.contains('sort-grid__btn--current', 'nav__link--current')
				);
				filterProducts.dataset.gridcolumns = currentButtn.dataset.gridbtn;
			}
		}

		resizeGallery();
	}


	//*select 'sort by'

	const customSelect = document.querySelectorAll('.custom-select');

	if (customSelect.length > 0) {
		customSelect.forEach(item => {
			item.addEventListener('click', (e) => {
				e.currentTarget.classList.toggle('custom-select--active')
				if (e.target.classList.contains('custom-select__item')) {
					let text = e.target.textContent;
					e.currentTarget.querySelector('.custom-select__top').textContent = text;
				}
			})
		})
	}


	//! categories check-boxes

	if (categoryContainer) {

		categoryContainer.addEventListener('change', function (e) {

			let closestItem = e.target.closest('.content-category__item');

			if (closestItem) {
				let checkedInput = closestItem.querySelector('input').checked;
				let spanText = closestItem.querySelector('.content-category__name').textContent;

				if (checkedInput) {
					closestItem.classList.add('active_checkbox');

					addButton(categoryChosen, spanText);
					updateCounters(closestItem, true);

				} else {

					closestItem.classList.remove('active_checkbox');
					autoRemoveButton(categoryChosen, spanText);
					updateCounters(closestItem, false);
				}

				let activeInputs = document.querySelectorAll('.active_checkbox');

				if (activeInputs.length > 0) {
					hideFilters.closest('.hide-filter').style.display = 'block';
					categoryChosen.style.display = 'inline-flex';
				} else {
					hideFilters.closest('.hide-filter').style.display = 'none';
					categoryChosen.style.display = 'none';
				}

			}
		})
	}


	//удаление выбранных категорий по нажатию на крестик и кнопку clear
	if (categoryChosen) {
		categoryChosen.addEventListener('click', removeButtonOnClick);
	}

	//ф-ция для добавления в HTML кнопок категорий
	function addButton(parent, text) {
		parent.style.display = 'flex';

		parent.insertAdjacentHTML(
			'afterbegin',
			`<button class="choice-filter__btn" data-choice="${text}">
	${text}
		<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
					/>
		</svg>
	</button>`)
	}


	function removeButtonOnClick(event) {

		if (event.target.classList.contains('choice-filter__btn')) {
			event.target.remove();

			let text = event.target.textContent.trim();
			const relatedCheckbox = document.querySelector(`[data-category="${text}"]`);
			relatedCheckbox.querySelector('input').checked = false;
			relatedCheckbox.classList.remove('active_checkbox');
			updateCounters(relatedCheckbox, false)
		}

		if (event.target.classList.contains('choice-filter__clear')) {
			clearAll();
		}

		if (event.currentTarget.children.length === 1) {
			event.currentTarget.style.display = 'none';
		}

	}

	// удаление кнопок при отщелкивании чекбокса
	function autoRemoveButton(parent, text) {
		const catButton = Array.from(parent.querySelectorAll('.choice-filter__btn'));
		if (catButton.length > 0) {
			catButton.forEach(button => {
				let buttonData = button.textContent.trimLeft().trimRight();
				if (buttonData === text) {
					button.remove();
				}
			})
		}
	}

	// функция clear all (очищает чекбоксы, удаляет кнопки, скрывает hide filters)
	function clearAll(e) {
		//отщелкиваем чекбоксы, убираем класс active
		const activeInputs = categoryContainer.querySelectorAll('input');

		activeInputs.forEach(input => {
			// const closest = input.closest('.contect-category__item');
			// console.log(closest);

			// if (input.checked) {
			// 	console.log(input.closest('.contect-category__item'));
			// 	input.closest('.contect-category__item').classList.remove('active_checkbox');
			// }
			input.checked = false;

		})
		//убираем счетчик span
		blockCategory.forEach(item => {
			item.classList.remove('open');
			item.dataset.counter = 0;
			item.querySelector('.quantity').style.display = 'none';
		})
		//удаляем кнопки в центре
		const activeButtons = categoryChosen.querySelectorAll('.choice-filter__btn');
		activeButtons.forEach(button => {
			button.remove();
			categoryChosen.style.display = 'none';
		})
		//скрываем кнопку hide filters
		hideFilters.closest('.hide-filter').style.display = 'none';
	}

	// счетчик кол-ва товаров
	function updateCounters(item, increment) {

		const closestParent = item.closest('.categories-filter__item');
		const counterSpan = closestParent.querySelector('.quantity');

		if (!closestParent.dataset.counter) {
			closestParent.dataset.counter = 0;
		}
		let counter = parseInt(closestParent.dataset.counter);

		if (increment) {
			counter++;
		} else {
			counter--;
		}

		if (counter > 0) {
			counterSpan.style.display = 'inline-flex';
		} else {
			counterSpan.style.display = 'none';
		}
		counterSpan.textContent = counter;
		closestParent.dataset.counter = counter;
	}

}