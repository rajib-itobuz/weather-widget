const tempField = document.getElementById("temp");
const locationField = document.getElementById("location");
const conditionField = document.getElementById("condition");
const dateField = document.getElementById("date");
const errorField = document.getElementById("errorArea");
const locationInput = document.getElementById("locationInput");
const weatherCard = document.getElementById("weatherCard");

const daysList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const clearweatherCardField = () => {
  tempField.textContent = `---`;
  locationField.textContent = `---`;
  conditionField.textContent = "----";
  dateField.textContent = `---`;
};

const validateWeatherData = (apiLocation, current) => {
  if (!apiLocation) throw new Error("Erroneous Data");
  else if (!"name" in apiLocation && "localtime" in apiLocation)
    throw new Error("Erroneous Data");

  if (!current) throw new Error("Erroneous Data");
  else if (
    !"last_updated" in current &&
    "feelslike_c" in current &&
    "condition" in current &&
    "precip_mm" in current &&
    "is_day" in current
  )
    throw new Error("Erroneous Data");
};

async function getWeatherData(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=0c80b2b56f1943ada19100744230103&q=${location.toLowerCase()}&aqi=no`,
      {
        mode: "cors",
      }
    );

    const weatherData = await response.json();

    const { location: apiLocation = undefined, current = undefined } =
      weatherData;

    validateWeatherData(apiLocation, current);

    const { name, localtime } = apiLocation;
    const { last_updated, feelslike_c, condition, precip_mm, is_day } = current;

    const date = new Date(localtime);

    errorField.innerHTML = `Last updated at : ${last_updated
      .toString()
      .substring(11)}`;
    errorField.style.color = "#31572c";

    tempField.textContent = `${feelslike_c.toFixed(0)}`;
    locationField.textContent = `${name}`;
    conditionField.textContent = condition.text;
    dateField.textContent = `${daysList[date.getDay()]}, ${date.getDate()} ${
      months[date.getMonth()]
    }`;

    if (precip_mm > 0) {
      weatherCard.classList.remove(...weatherCard.classList);
      weatherCard.className = "container rainy";
    } else if (is_day) {
      weatherCard.classList.remove(...weatherCard.classList);
      weatherCard.className = "container sunny";
    } else {
      weatherCard.classList.remove(...weatherCard.classList);
      weatherCard.className = "container night";
    }
  } catch (error) {
    clearweatherCardField();
    errorField.textContent = error.message;
    errorField.style.color = "#ef476f";
  }
}

async function getCurrentLocation(position) {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.latitude}&longitude=${position.longitude}&localityLanguage=en`
    );

    const { city } = await response.json();
    if (city) getWeatherData(city);
    else throw Error;
  } catch (error) {
    console.error("Cannot fetch current Location");
  }
}

locationInput.addEventListener("change", (e) => {
  getWeatherData(e.target.value);
});

(() => {
  clearweatherCardField();
  errorField.innerHTML = `Detecting Location ....`;
  errorField.style.color = "#31572c";
  window.navigator.geolocation.getCurrentPosition((position) => {
    getCurrentLocation(position);
  });
})();
