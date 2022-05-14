import axios from 'axios';

async function fetchCountries() {
    try {
        const response = await axios.get('https://restcountries.com/v2/all');
        const countries = response.data;

        countries.sort((a, b) => {
            return a.population - b.population;
        });

        addCountriesToList(countries);
    } catch (error) {
        console.error(error);
    }
}

const countryListHTML = document.getElementById('country-list');

if (countryListHTML) fetchCountries();

function addCountriesToList(countries){

    countryListHTML.innerHTML = countries.map((country) => {
        return `
            <li>
                <h4 class="title ${countryRegion(country.region)}"><img src="${country.flag}" alt="Vlag - ${country.name}" class="flag" /> <span class="name">${country.name}</span></h4>
                <p class="population">Has a population of ${country.population} people.</p>
            </li>
        `;
    }).join('');
}

function countryRegion(currentRegion) {
    switch (currentRegion) {
        case 'Africa':
            return 'blue';
        case 'Americas':
            return 'green';
        case 'Asia':
            return 'red';
        case 'Europe':
            return 'yellow';
        case 'Oceania':
            return 'purple';
        default:
            return 'default';
    }
}

function searchSubmit(event) {
    searchCountry(field.value);
    event.preventDefault();
}

const form = document.getElementById('searchform');
const field = document.getElementById('search');
const errorNotification = document.getElementById('error-notification');
const searchHTML = document.getElementById('datafetch');

form.addEventListener('submit', searchSubmit);

async function searchCountry(searchCountryName) {

    errorNotification.innerHTML = "";
    errorNotification.classList.remove("show");
    searchHTML.innerHTML = "";
    field.value = '';

    if('' !== searchCountryName){
        try {
            const response = await axios.get('https://restcountries.com/v3.1/name/' + searchCountryName);
            const countries = response.data;

            showResult(countries);
        } catch (error) {
            errorNotification.classList.add("show");
            errorNotification.insertAdjacentHTML('afterbegin', '<li>' + error.toString() + '</li>');
        }
    } else {
        errorNotification.classList.add("show");
        errorNotification.insertAdjacentHTML('afterbegin', '<li>Warning: Field is empty</li>');
    }
}

function showResult(countries){

    searchHTML.innerHTML = countries.slice(0, 1).map((country) => {
        return `
            <div class="country">
                <h4 class="title ${countryRegion(country.region)}"><img src="${country.flags.png}" alt="Vlag - ${country.name.common}" class="flag" /> <span class="name">${country.name.common}</span></h4>
                <p class="meta">
                    <span>${country.name.common} is situated in ${country.subregion}. It has a population of ${country.population} people.</span>
                    <span>The capital is ${country.capital} and you can pay with ${getCurrencyNames(country.currencies)}.</span>
                    <span>They speak ${getLanguages(country.languages)}.</span>
                </p>
            </div>
        `;
    }).join('');
}

function getCurrencyNames(currenies){

    let currencyArray = [];

    Object.entries(currenies).forEach(([key, value]) => {
        const name = String(value.name);
        if('' !== name) currencyArray.push(name);
    });

    return seperateValues(currencyArray);

}

function getLanguages(languages){
    let languageArray = [];

    Object.entries(languages).forEach(([key, value]) => {
        const name = String(value);
        if('' !== name) languageArray.push(name);
    });

    return seperateValues(languageArray);
}

function seperateValues(array){
    return [array.slice(0, -1).join(', '), array.slice(-1)[0]].join(array.length < 2 ? '' : ' and ');
}