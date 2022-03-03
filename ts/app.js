// --- Class --- //
class Joke {
    id;
    joke;
    score;
    date;
    constructor(id, joke, score = 0, date) {
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
    }
    catch (error) {
        throw new Error(error);
    }
};
const loadChuckJokes = async () => {
    try {
        const loadChuckJokes = await fetch("https://api.chucknorris.io/jokes/random")
            .then((response) => response.json())
            .then((data) => addJoke(data));
    }
    catch (error) {
        throw new Error(error);
    }
};
const loadWeather = async () => {
    try {
        const loadWeather = await fetch('https://api.openweathermap.org/data/2.5/weather?q=barcelona&appid=79249a6da5a4a52e43bdc6a5bce6de66')
            .then((response) => response.json())
            .then((data) => printWeather(data));
    }
    catch (error) {
        throw new Error(error);
    }
};
// --- End API Calls --- //
// --- Globals --- //
const reportJokes = [];
let currentJokeId;
let isVoted = false;
let score;
const nextJoke = document.getElementById('button');
const joke = document.getElementById('joke');
const iconWeather = document.getElementById('icon-weather');
const textWeather = document.getElementById('text-weather');
const emoticons = document.getElementById('emoticons');
const blob = document.getElementById('blob');
const button = document.getElementById('button');
const randomJoke = () => {
    const flipCoin = Math.random() * 10;
    return flipCoin < 5 ? loadJokes() : loadChuckJokes();
};
const randomBlob = () => {
    const num = Math.round(Math.random() * 5);
    blob.style.backgroundImage = `url(../img/blob${num}.svg)`;
};
const changeTextButton = () => {
    button.innerHTML = 'Next Joke >>';
};
// --- Events --- //
window.addEventListener('load', () => {
    loadWeather();
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
    if (!isVoted) {
        score = vote(e.target);
        updateScore();
        isVoted = true;
    }
});
const addJoke = (obj) => {
    currentJokeId = obj.id;
    let hasJoke = reportJokes.some(i => i.id === currentJokeId);
    const date = new Date();
    if (!hasJoke) {
        const joke = new Joke(obj.id, obj.joke || obj.value, obj.score, date);
        reportJokes.push(joke);
    }
    else {
        reportJokes.filter(i => i.id === currentJokeId)
            .map(i => i.date = date.toISOString());
    }
    printJoke(obj);
    console.log(reportJokes);
};
const printJoke = (obj) => {
    if (obj.joke || obj.value !== undefined) {
        joke.innerHTML = obj.joke || obj.value;
    }
};
function printWeather({ weather }) {
    const [w] = weather;
    const img = w.icon;
    const imgURL = `http://openweathermap.org/img/wn/${img}@2x.png`;
    textWeather.innerHTML = w.main;
    iconWeather.innerHTML = `<img src="${imgURL}">`;
}
function vote(e) {
    let score = 0;
    const msg = 'Thank you for vote. Have a nice day!';
    switch (e.name) {
        case 'vote-desagree':
            score = 1;
            break;
        case 'vote-normal':
            score = 2;
            break;
        case 'vote-agree':
            score = 3;
            break;
    }
    showMsg(msg, score);
    return score;
}
function showEmoticons() {
    emoticons.classList.replace('hide', 'show');
}
function showMsg(msg, score) {
    alert(`${msg} Your score is: ${score}`);
}
function updateScore() {
    reportJokes.filter((i) => i.id === currentJokeId)
        .map(i => i.score += score);
    console.log(reportJokes);
}
