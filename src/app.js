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

fetchCountries();

function addCountriesToList(countries){
    const countryListHTML = document.getElementById('country-list');

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
