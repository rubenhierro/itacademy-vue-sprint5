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
      .then((data) => addJoke(data));
  } catch (error) {
    console.log(error);
  }
};

const loadChuckJokes = async () => {
  try {
    const loadChuckJokes = await fetch("https://api.chucknorris.io/jokes/random")
      .then((response) => response.json())
      .then((data) => addJoke(data));
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
const blob: HTMLElement = document.getElementById('blob');
const button: HTMLElement = document.getElementById('button');


const randomJoke = () => {
  const flipCoin = Math.random() * 10;
  return flipCoin < 5 ? loadJokes() : loadChuckJokes();
}

const randomBlob = () => {
  const num: number = Math.round(Math.random() * 5);
  blob.style.backgroundImage = `url(../img/blob${num}.svg)`;
  console.log(num);
}

const changeTextButton = () => {
  button.innerHTML = 'Next Joke >>';
}

// --- Events --- //
window.addEventListener('load', () => {
  // loadWeather()
  randomBlob();
});

nextJoke.addEventListener('click', () => {
  randomJoke();
  randomBlob();
  showEmoticons();
  changeTextButton();
  isVoted = false;
});

emoticons.addEventListener('click', (e) => {
  if(!isVoted) {
    score = vote(e.target);
    updateScore();
    isVoted = true;
  }
});

const addJoke = (obj): void => {
  currentJokeId = obj.id;
  let hasJoke = reportJokes.some(i => i.id === currentJokeId);
  const date: Date = new Date();

  if(!hasJoke) {
    const joke: Joke = new Joke(obj.id, obj.joke || obj.value, obj.score, date);
    reportJokes.push(joke);
  } else {
    reportJokes.filter(i => i.id === currentJokeId)
    .map(i => i.date = date.toISOString())
  }
  
  printJoke(obj);
  console.log(reportJokes);
};

const printJoke = (obj): void => {
  if (obj.joke || obj.value !== undefined) {
    joke.innerHTML = obj.joke || obj.value;
  }
};

function printWeather ({weather}): void {
    const [w] = weather;
    //falta imatge
    textWeather.innerHTML = w.main;
}

function vote(e: any): number {
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

function showEmoticons(): void {
  emoticons.classList.replace('hide', 'show');
}

function showMsg(msg, score): void {
  alert(`${msg} El teu vot es: ${score}`)
}

function updateScore(): void {
  reportJokes.filter((i) => i.id === currentJokeId)
  .map(i => i.score += score);
  console.log(reportJokes);
}

