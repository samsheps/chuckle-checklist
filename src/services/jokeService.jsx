
// **** READ ****
export const getAllJokes = () => {
    return fetch("http://localhost:8088/jokes").then((res) => res.json());
};

// **** CREATE ****
export const postNewJoke = async (defaultState) => {
    // here we're setting a function (postNewJoke), it's asyncronous, and we're passing in the default state format as an argument
    const postInstructions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(defaultState), // defaultState is just a parameter that's later an argument
    };
    // above are instructions for the post method; the body of it will be the default state stringified

    return fetch("http://localhost:8088/jokes", postInstructions).then((res) =>
        res.json() // promise gets resolved, .THEN we have access to that object 
    ); // fetch is a catchall word; it's simply the way we interact w/the database; the "then" means once it's done, ensure the response is in the json format
};

/* **** UPDATE **** 
The below functino is allowing us to update the categorization of jokes "told?"
and "untold?" and move them upon click */
export const updateJoke = async (updatedJokeObject) => {
    const updateInstructions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedJokeObject),
    };
    return fetch(`http://localhost:8088/jokes/${updatedJokeObject.id}`, updateInstructions).then((res) =>
      res.json()
    );
  };

// **** DELETE ****
export const deleteJoke = async (id, jokeObject) => {
    const deleteInstructions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jokeObject),
    };
    return fetch(`http://localhost:8088/jokes/${id}`, deleteInstructions).then((res) =>
      res.json()
    );
  }; 
  

/* in this module we are: 
  fetching 
  posting a new joke 
  updating
  deleting */

/* you never want your component speaking directly to your databse.
this module helps us do this. */