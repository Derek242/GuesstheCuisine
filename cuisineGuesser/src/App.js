import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [meal, setMeal] = useState(null); // Stores the random meal
  const [areas, setAreas] = useState([]); // Stores all countries/areas
  const [feedback, setFeedback] = useState(""); // Stores feedback for the player
  const [chances, setChances] = useState(50); // Number of remaining chances
  const [gameOver, setGameOver] = useState(false); // Whether the game is over
  const [score, setScore] = useState(0);  // Player's score

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
      // Decrement chances only on incorrect guesses
      setChances((prevChances) => {
        const updatedChances = prevChances - 1;
        if (updatedChances === 0) {
          setGameOver(true); // End the game when chances run out
        }
        return updatedChances;
      });
    }
  };

  // Restart the game
  const restartGame = () => {
    setChances(50);
    setGameOver(false);
    setFeedback("");
    fetchRandomMeal(); // Start with a new random meal
  };

  return (
    <div>
      <h1>Food Guesser Game</h1>
      {meal ? (
        <div>
          <img
            src={meal.image}
            alt="Random Meal"
            style={{ width: "300px", height: "300px" }}
          />
          <p>Remaining Chances: {chances}</p>
          <p>Score: {score}</p> {/* Display player's score */}
          {gameOver && <button onClick={restartGame}>Restart Game</button>}
        </div>
      ) : (
        <p>Loading meal...</p>
      )}

      <h2>Guess the country:</h2>
      <div>
        {areas.length > 0 ? (
          areas.map((area) => (
            <button key={area} onClick={() => handleGuess(area)}>
              {area}
            </button>
          ))
        ) : (
          <p>Loading countries...</p>
        )}
      </div>

      <h3>{feedback}</h3>
    </div>
  );
}

export default App;
