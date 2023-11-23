const apiKey = "79d238d9e1e44d16aef131908232011";

const form = document.querySelector(".form");
const input = document.querySelector(".input");
const header = document.querySelector(".header");
let condition = null;

fetch("https://www.weatherapi.com/docs/conditions.json")
  .then((response) => response.json())
  .then((data) => (condition = data));

const removeCard = () => {
  const prevCard = document.querySelector(".card");
  if (prevCard) prevCard.remove();
};

const showError = (errorMessage) => {
  if (errorMessage) {
    const html = `<div class="card">${errorMessage}</div>`;
    console.error("Ошибка поймана, Вы ввели неверное название города");
    header.insertAdjacentHTML("afterend", html);
  }
};

const showCard = ({ name, country, temp, condition, id }) => {
  const html = `<div class="card">
          <h2 class="card__city">${name}<span>${country}</span></h2>
          <div class="card__weather">
          <div class="card__value"><sup>${temp}°C</sup></div>
          <img class="card__img" src=${id} alt="weather" />
          </div>
          <div class="card__description">${condition}</div>
      </div>`;

  header.insertAdjacentHTML("afterend", html);
};

async function getWeather(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

form.onsubmit = async function (e) {
  e.preventDefault();
  let city = input.value;

  const data = await getWeather(city);

  if (data.error) {
    removeCard();
    showError(data.error.message);
  } else {
    removeCard();

    const informationCode = condition.find(
      (obj) => obj.code === data.current.condition.code
    );
    const findIdRussianLanguage = informationCode.languages[23];

    const conditions = data.current.is_day
      ? findIdRussianLanguage["day_text"]
      : findIdRussianLanguage["night_text"];

    const weatherData = {
      name: data.location.name,
      country: data.location.country,
      temp: data.current.temp_c,
      condition: conditions,
      id: data.current.condition.icon,
    };

    showCard(weatherData);
    input.value = "";
  }
};
