import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [meal, setMeal] = useState(null); // Stores the random meal
  const [areas, setAreas] = useState([]); // Stores all countries/areas
  const [feedback, setFeedback] = useState(""); // Stores feedback for the player
  const [lives, setLives] = useState(5); // Number of remaining lives, default to 5
  const [gameOver, setGameOver] = useState(false); // Whether the game is over
  const [score, setScore] = useState(0);  // Player's score
  const [guessedAreas, setGuessedAreas] = useState(new Set()); // Track guessed areas

  // Function to fetch a random meal
  const fetchRandomMeal = () => {
    fetch("http://localhost:5000/api/random-meal") // Fetching from backend
      .then((response) => response.json())
      .then((data) => {
        console.log("Meal fetched:", data); // Check what data is logged here
        setMeal(data);
      })
      .catch((error) => console.error("Error fetching meal:", error));
  };

  // Fetch the random meal when the component mounts or after a correct guess
  useEffect(() => {
    fetchRandomMeal();
  }, []);

  // Fetch the list of areas when the component mounts
  useEffect(() => {
    fetch("http://localhost:5000/api/areas")
      .then((response) => response.json())
      .then((data) => setAreas(data))
      .catch((error) => console.error("Error fetching areas:", error));
  }, []);

  // Handle player's guess
  const handleGuess = (selectedArea) => {
    if (gameOver) return;

    if (meal && selectedArea === meal.country) {
      setFeedback("Correct! 🎉");
      setScore((prevScore) => prevScore + 1); // Increment score for correct guess
      fetchRandomMeal(); // Fetch a new random meal after a correct guess
    } else {
      setFeedback("Wrong! Try again.");
  
       // Decrement lives only on incorrect guesses
       setLives((prevLives) => {
        const updatedLives = prevLives - 1;
        if (updatedLives === 0) {
          setGameOver(true); // End the game when lives run out
        }
        return updatedLives;
      });
      // Disable the button for this area
    setGuessedAreas(new Set([...guessedAreas, selectedArea]));

    }
  };

  // Restart the game
  const restartGame = () => {
    setLives(5);
    setScore(0); // Reset the score to zero
    setGameOver(false);
    setFeedback("");
    setGuessedAreas(new Set()); // Clear guessed areas
    fetchRandomMeal(); // Start with a new random meal
  };

  return (
    <div>
      <h1>Guess The Cuisine</h1>
      {meal ? (
        <div>
          <img
            src={meal.image}
            alt="Random Meal"
            style={{ width: "300px", height: "300px" }}
          />
          <p>
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                style={{
                  fontSize: "5rem",
                  color: i < lives ? "red" : "gray",
                  margin: "0 5px",
                }}
              >
                ♥
              </span>
            ))}
          </p>
          <p>Score: {score}</p> {/* Display player's score */}
          {gameOver && <button onClick={restartGame}>Restart Game</button>}
        </div>
      ) : (
        <p>Loading meal...</p>
      )}

      <h2>Guess the country:</h2>
      <h3>{feedback}</h3>
      <div>
        {areas.length > 0 ? (
          areas.map((area) => (
            <button key={area} onClick={() => handleGuess(area)}
              disabled={guessedAreas.has(area)} // Disable button if already guessed
              style={{
                backgroundColor: guessedAreas.has(area) ? "#ccc" : "#DAA06D",
              }}
            >
              {area}
            </button>
          ))
        ) : (
          <p>Loading countries...</p>
        )}
      </div>     

    
    </div>
  );
  
}

export default App;
