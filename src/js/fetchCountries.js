export default function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v2/';
  const API_ENDPOINT = 'name';
  const FILTERS = '?fields=name,capital,flags,languages,population';

  return fetch(`${BASE_URL}${API_ENDPOINT}/${name}${FILTERS}`)
    .then(r => r.json())
    .catch(console.log);
}
