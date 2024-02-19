// async function getWeatherData(location) {
//   const apiData = await fetch(
//     `https://api.weatherapi.com/v1/current.json?key=0c80b2b56f1943ada19100744230103&q=${location}&aqi=no`,
//     {
//       mode: "cors",
//     }
//   );
//   const response = await apiData.json();
//   return response;
// }
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

async function getWeatherData(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=0c80b2b56f1943ada19100744230103&q=${location.toLowerCase()}&aqi=no`,
      {
        mode: "cors",
      }
    );
    const weatherData = await response.json();

    const date = new Date(weatherData.location.localtime);

    errorField.textContent = "";
    tempField.textContent = `${weatherData.current.feelslike_c.toFixed(0)}`;
    locationField.textContent = `${weatherData.location.name}`;
    conditionField.textContent = weatherData.current.condition.text;
    dateField.textContent = `${daysList[date.getDay()]}, ${date.getDate()} ${
      months[date.getMonth()]
    }`;

    if (weatherData.current.is_day) {
      weatherCard.classList.replace(weatherCard.classList[1], "sunny");
    } else if (weatherData.current.precip_mm > 0)
      weatherCard.classList.replace(weatherCard.classList[1], "rainy");
    else {
      weatherCard.classList.replace(weatherCard.classList[1], "night");
    }
  } catch (error) {
    tempField.textContent = `----`;
    locationField.textContent = `---`;
    conditionField.textContent = "----";
    dateField.textContent = `---`;
    errorField.textContent = "Location not found";
  }
}

locationInput.addEventListener("change", (e) => {
  getWeatherData(e.target.value);
});
