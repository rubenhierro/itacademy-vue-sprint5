const loadJokes = async () => {
  try {
    const loadJokes = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  } catch (error) {
    console.log(error);
  }
};

loadJokes();
