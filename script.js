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

    if (weatherData) {
      const date = new Date(weatherData.location.localtime);

      errorField.innerHTML = `Data Fetched at : ${weatherData.current.last_updated
        .toString()
        .substring(11)}`;
      errorField.style.color = "#31572c";
      tempField.textContent = `${weatherData.current.feelslike_c.toFixed(0)}`;
      locationField.textContent = `${weatherData.location.name}`;
      conditionField.textContent = weatherData.current.condition.text;
      dateField.textContent = `${daysList[date.getDay()]}, ${date.getDate()} ${
        months[date.getMonth()]
      }`;
      if (weatherData.current.precip_mm > 0)
        weatherCard.classList.replace(weatherCard.classList[1], "rainy");
      else if (weatherData.current.is_day) {
        weatherCard.classList.replace(weatherCard.classList[1], "sunny");
      } else {
        weatherCard.classList.replace(weatherCard.classList[1], "night");
      }
    }
  } catch (error) {
    tempField.textContent = `----`;
    locationField.textContent = `---`;
    conditionField.textContent = "----";
    dateField.textContent = `---`;
    errorField.textContent = "Location not found";
    errorField.style.color = "#ef476f";
  }
}

locationInput.addEventListener("change", (e) => {
  getWeatherData(e.target.value);
});

tempField.textContent = `----`;
locationField.textContent = `---`;
conditionField.textContent = "----";
dateField.textContent = `---`;
