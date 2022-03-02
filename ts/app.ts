// --- API Calls --- //

const loadJokes = async () => {
  try {
    const loadJokes = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => printJoke(data));
  } catch (error) {
    console.log(error);
  }
};

const loadChuckJokes = async () => {
  try {
    const loadChuckJokes = await fetch("https://api.chucknorris.io/jokes/random")
      .then((response) => response.json())
      .then((data) => printChuckJoke(data));
  } catch (error) {
    console.log(error);
  }
};

const loadWeather = async () => {
  try {
    const loadWeather = await fetch('https://api.openweathermap.org/data/2.5/weather?q=barcelona&appid=79249a6da5a4a52e43bdc6a5bce6de66')
      .then((response) => response.json())
      .then((data) => printWeather(data));
  } catch (error) {
    console.log(error);
  }
};
// --- End API Calls --- //


const nextJoke = document.getElementById('button');
const joke = document.getElementById('joke');
const iconWeather = document.getElementById('icon-weather');
const textWeather = document.getElementById('text-weather');


const randomJoke = () => {
  const flipCoin = Math.random() * 10;
  return flipCoin < 5 ? loadJokes() : loadChuckJokes();
}

// --- Events --- //
window.addEventListener('load', () => {
  loadWeather()
});

nextJoke.addEventListener('click', () => {
  randomJoke();
  printJoke(joke);
});

const printJoke = (text) => {
  if (text.joke !== undefined) {
    joke.innerHTML = text.joke;
  }
};

const printChuckJoke = (text) => {
  if (text.value !== undefined) {
    joke.innerHTML = text.value;
  }
}

function printWeather ({weather}) {
    const [w] = weather;
    //falta imatge
    textWeather.innerHTML = w.main;
}

