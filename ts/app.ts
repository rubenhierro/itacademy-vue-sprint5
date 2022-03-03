interface Ijoke {
  id: string;
  joke: string;
  score: number;
  date: string;
}

class Joke implements Ijoke {
  id: string;
  joke: string;
  score: number;
  date: string;

  constructor(id: string, joke: string, score = 0, date: Date) {
    this.id = id;
    this.joke = joke;
    this.score = score;
    this.date = date.toISOString();
  }
}

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


// --- Globals --- //
const reportJokes: Array<Joke> = [];
let currentJokeId: string;
let isVoted: boolean = false;
let score: number;

const nextJoke: HTMLElement = document.getElementById('button');
const joke: HTMLElement = document.getElementById('joke');
const iconWeather: HTMLElement = document.getElementById('icon-weather');
const textWeather: HTMLElement = document.getElementById('text-weather');
const emoticons: HTMLElement = document.getElementById('emoticons');


const randomJoke = () => {
  const flipCoin = Math.random() * 10;
  return flipCoin < 5 ? loadJokes() : loadChuckJokes();
}

// --- Events --- //
window.addEventListener('load', () => {
  // loadWeather()
});

nextJoke.addEventListener('click', () => {
  randomJoke();
  printJoke(joke);
  showEmoticons();
  isVoted = false;
});

emoticons.addEventListener('click', (e) => {
  if(!isVoted) {
    score = vote(e.target);
    updateScore();
    isVoted = true;
  }
});

const addJoke = (obj) => {
  currentJokeId = obj.id;
  const date: Date = new Date();
  const joke: Joke = new Joke(obj.id, obj.joke || obj.value, obj.score, date);
  reportJokes.push(joke);
  console.log(reportJokes);
};

const printJoke = (obj) => {
  if (obj.joke !== undefined) {
    addJoke(obj);
    joke.innerHTML = obj.joke;
  }
};

const printChuckJoke = (obj) => {
  if (obj.value !== undefined) {
    addJoke(obj);
    joke.innerHTML = obj.value;
  }
}

function printWeather ({weather}) {
    const [w] = weather;
    //falta imatge
    textWeather.innerHTML = w.main;
}

function vote(e: any) {
  let score: number = 0;
  const msg: string = 'Thank you for vote. Have a nice day!';
  switch(e.name) {
    case 'vote-desagree': score = 1;  break;
    case 'vote-normal': score = 2; break;
    case 'vote-agree': score = 3; break;
  }

  showMsg(msg, score);
  return score;
}

function showEmoticons() {
  emoticons.classList.replace('hide', 'show');
}

function showMsg(msg, score) {
  alert(`${msg} El teu vot es: ${score}`)
}

function updateScore() {
  reportJokes.filter((i) => i.id === currentJokeId)
  .map(i => i.score += score);
  console.log(reportJokes);
}

