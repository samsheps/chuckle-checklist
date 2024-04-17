import "./App.css";
import stevePic from "./assets/steve.png";
import { useState, useEffect } from "react";
import { getAllJokes, postNewJoke, updateJoke, deleteJoke } from "./services/jokeService.jsx";

export const App = () => { // App is a component (the whole thing)
  const [newJoke, setNewJoke] = useState(""); // (currently empty) string will be newJoke, setNewJoke will be the function that fills the empty string / this is a single joke, not multiple, so it will be a string
  const [allJokes, setAllJokes] = useState([]) // allJokes is the result of running setAllJokes
  const [toldJokes, setToldJokes] = useState([])
  const [untoldJokes, setUntoldJokes] = useState([])

  // setAllJokes(jokeArray) return value = allJokes 
  // setNewJoke(taco); newJoke = taco

  useEffect(() => {
    fetchJokes()
  }, []); // this use effect will run on the initial render & it will not run again unLESS the component is reloaded

  useEffect(() => { // all useEffects will run when the component loads concurrently
    // once fetchJokes completes, this useEffect knows it needs to run again bc it now has jokes to act on (now we're > 0)
    if (allJokes.length > 0) { // on the initial render, bc the useEffects run at the same time, the length will be 0
      const told = allJokes.filter((joke) => joke.told);
      const untold = allJokes.filter((joke) => !joke.told);
      setToldJokes(told); // the result of this will be "toldJokes"
      setUntoldJokes(untold); // the result of this will be "untoldJokes"
      setNewJoke("") // this just resets newJoke to an empty string; this changes the state of newJoke; 
      // when newJoke state changes, we've set the value to whatever's in the input HTML
    }
  }, [allJokes]); // in this dependency array, we're watching for when allJokes changes; when it does, this useEffect rerenders. 
  // this will always be the case for dependency arrays (watching for the state changing in the dep. array, rerendering the useEffect when it does)

  const fetchJokes = () => { // this is our render function. it is also a utility function -- can use more than once. do this whenever you find you're duplicating code.
    // getAllJokes().then((allJokesArray) => { // once you get that data, set it & call it allJokesArray
    // setAllJokes(allJokesArray); // the set function for state will trigger a rerender of our component; if we're setting our tickets here then we're rerendering our component
    getAllJokes().then(setAllJokes) //(accomplishes the same as above two lines)
  }

  const handleAddJoke = () => {
    //console.log("handleAddJokefired")
    const defaultState = { // json server auto-assigns IDs so we don't need that in our state here 
      text: newJoke,
      told: false,
    };
    postNewJoke(defaultState).then(() => { // defaultState is a joke object & it will be the payload
      // console.log(x) -- here we get the joke object back bc of how we defined postNewJoke in jokeService in lines 16 & 17
      // Fetch all jokes again to update the list
      // postNewJoke is what's talking to the api 
      fetchJokes() // here we're fetching our updated collection of jokes 
    });
  }; 
  
 const markAsDeleted = (id, jokeObject) => {
    deleteJoke(id, jokeObject).then(() => fetchJokes()); // here we're saying use the function "deleteJoke" using parameters id and jokeObject
  };
  
  const markAsTold = (id) => {
    const updatedJoke = {
      ...allJokes.find((joke) => joke.id === id),
      told: true,
    };

    updateJoke(updatedJoke)
      .then(() => fetchJokes());
  };

  const markAsUntold = (id) => {
    const updatedJoke = {
      ...allJokes.find((joke) => joke.id === id),
      told: false,
    };

    updateJoke(updatedJoke)
      .then(() => fetchJokes());
  };


  // below is the jsx that will get rendered into HTML
  return (
    <div className="app-container">
      <div className="app-heading-circle">
        <img className="app-logo" src={stevePic} alt="Good job Steve" />
      </div>
      <div className="app-heading">
        <h1 className="app-heading-text">Chuckle Checklist</h1>
      </div>
      <h2>Add Joke</h2>
      <div className="joke-add-form">
        <input
          className="joke-input"
          value={newJoke} //here we're saying the value of the input will always = newJoke; on line 42 (at "setNewJoke("")) we set it to a new string 
          type="text"
          placeholder="New One Liner"
          onChange={(event) => {
            setNewJoke(event.target.value) // this = newJoke; when there's a change that occurs in our input field, let's run setNewJoke;
            //we're passing into setNewJoke the event.target.value of the event (which is the change in the input field)
            //console.log(newJoke); // here we're console logging the event in the onChange
          }}
        />
        <button
          onClick={() => {
            // here we're creating our default state (id is assumed so you don't need to declare that default state)
            // we're aleady brining in the below via handleAddJoke()
            //  const defaultState = { 
            //  "text": newJoke,
            //    "told": false
            //  };
            //  postNewJoke(defaultState) // posts the joke to the database
            //  setNewJoke("")
            handleAddJoke() // thanks for posting that new joke! now let's make it an empty string again
          }} // we want to assume we haven't told a new joke yet
        //need to write out a function to refresh (will go inside the then statement)
        >
          Add Joke!
        </button>
      </div>
      <div className="joke-lists-container">
        <div className="joke-list-container">
          <h2>Told Jokes {toldJokes.length}</h2>
          <ul>
            {toldJokes.map((joke) => (
              <li key={joke.id}>{joke.text}
                <div className="joke-list-action-toggle">
                  <button onClick={() => markAsUntold(joke.id)}>Untold?</button>
                  <button onClick={() => markAsDeleted(joke.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="joke-list-container">
          <h2>Untold Jokes {untoldJokes.length}</h2>
          <ul>
            {untoldJokes.map((joke) => (
              <li key={joke.id}>{joke.text}
                <div className="joke-list-action-toggle">
                  <button onClick={() => markAsTold(joke.id)}>Told?</button>
                  <button onClick={() => markAsDeleted(joke.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
        </div>
      </div>
    </div>
  );
};

// via useState, create a place where we can store our transient state
// aka we're introducing state to our component
// some of this follows honey rae, some doesn't
// when you establish the useState for establishing allTickets
//need to establish a useState function to set and capture that new joke
//proper syntax is the array

//we only wait for a response when we're reaching into a database

/* three things: 
1) passing in an initial value as it's argument ("")--the default state; 
the updated/return value will be a newJoke and the setNewJoke
2) use state contians an array
first value is always the state value ()
3) the function to modify that state (aka a callback function bc it's passed as an argument to another fuction)
aka setNewJoke

this will help us log taht change. everything being returned is your jsx

const [newJoke, setNewJoke] = useState("") <this is just the utility function from the react library
useState("") <this is just the utility function from the react library
all we're doing here is setting a function that will allow us to store 
our transient state
*/
