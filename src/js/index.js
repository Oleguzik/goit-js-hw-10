import '../css/styles.css';
import '~/node_modules/notiflix/dist/notiflix-3.2.5.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const inputFieldRef = document.querySelector('input#search-box');
const countryListRef = document.querySelector('ul.country-list');
const countryInfoRef = document.querySelector('div.country-info');
const loadingImageRef = document.querySelector('.loading-image');

inputFieldRef.addEventListener('input', debounce(doSearch, DEBOUNCE_DELAY));
countryListRef.addEventListener('click', onClickLink);

function doSearch(e) {
  const searchName = e.target.value.trim();

  if (searchName.length) {
    showLoadingImage(true);
    if (searchName) {
      fetchCountries(searchName)
        .then(countries => {
          drawCountries(countries);
        })
        .finally(() => {
          showLoadingImage(false);
        });
    }
  } else {
    clearSearchList();
  }
}

function showLoadingImage(show = true) {
  if (show) {
    loadingImageRef.classList.remove('is-hidden');
    inputFieldRef.disabled = true;
    return;
  }

  loadingImageRef.classList.add('is-hidden');
  inputFieldRef.disabled = false;
  inputFieldRef.focus();
}

function clearSearchList() {
  countryInfoRef.innerHTML = '';
  countryListRef.innerHTML = '';
}

function drawCountries(countries) {
  clearSearchList();

  // console.log(countries);

  if (countries.length > 10) {
    Notify.info(
      'Знайдено забагато збігів. Будь ласка, введіть більш конкретне ім1я.'
    );
  } else if (countries.length > 1) {
    countryListRef.innerHTML = markupCountryList(countries);
  } else if (countries.length === 1) {
    countryInfoRef.innerHTML = markupCountryInfo(countries[0]);
  } else {
    Notify.failure('На жаль, країни з такою назвою немає');
  }
}

function markupCountryList(countries) {
  // console.log(countries);
  return countries
    .map(
      country => `
      <li class="country-list__item">
        <a data-href="${country.name}" class="country-list__link" href="#">
          <img  data-href="${country.name}"class="country-list__image" width="60" src="${country.flags.svg}" alt="${country.name}">
          <p data-href="${country.name}" class="country-list__name">${country.name}</p>
        </a>
      </li>`
    )
    .join('');
}

function markupCountryInfo({ languages, flags, name, capital, population }) {
  return `
    <div class="country-info__title-wrapper">
      <img class="country-info__image" width="90" src="${
        flags.svg
      }" alt="${name}">
      <p class="country-info__title">${name}</p>
    </div>
    <p class="country-info__text"><span class="country-info__label">Столиця:</span> ${capital}</p>
    <p class="country-info__text"><span class="country-info__label">Населення:</span> ${population}</p>
    <p class="country-info__text"><span class="country-info__label">Мова:</span> ${languages
      .map(language => language.name)
      .join(', ')}</p>`;
}

function onClickLink(e) {
  e.preventDefault();

  inputFieldRef.value = e.target.dataset.href.trim();
  console.log(e.target);
  doSearch({ target: inputFieldRef });
}
