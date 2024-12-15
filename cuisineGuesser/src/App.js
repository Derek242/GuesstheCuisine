
import React, { useState, useEffect } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db } from "./config/firebase";
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null); // Tracks logged-in user
  const [meal, setMeal] = useState(null); // Stores the random meal
  const [areas, setAreas] = useState([]); // Stores all countries/areas
  const [feedback, setFeedback] = useState(""); // Stores feedback for the player
  const [lives, setLives] = useState(5); // Number of remaining lives, default to 5
  const [gameOver, setGameOver] = useState(false); // Whether the game is over
  const [score, setScore] = useState(0); // Player's score
  const [guessedAreas, setGuessedAreas] = useState(new Set()); // Track guessed areas
  const [highestScore, setHighestScore] = useState(0); // Highest score for logged-in user
  const scoreCollection = collection(db, "Users"); // Gets the collection from the users db on Firestore

  // Function to fetch a random meal
  const fetchRandomMeal = () => {
    fetch("http://localhost:5000/api/random-meal") // Fetching from backend
      .then((response) => response.json())
      .then((data) => {
        console.log("Meal fetched:", data); // Check what data is logged here -- just for testing
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

  // Fetch the highest score for the logged-in user
  useEffect(() => {
    const fetchUserHighestScore = async (email) => {
      if (!email) return;

      try {
        const userDocRef = doc(db, "Users", email);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setHighestScore(userData.hscore || 0);
        } else {
          setHighestScore(0); // Default to 0 if no record exists
        }
      } catch (error) {
        console.error("Error fetching user's highest score:", error);
      }
    };

    if (user?.email) {
      fetchUserHighestScore(user.email);
    }
  }, [user]);

  // Function to update the highest score in Firestore
  const updateHighestScore = async (currentScore) => {
    if (!user?.email) {
      console.error("No user email found. Cannot update score.");
      return;
    }
  
    try {
      // Use the user's email as the document ID
      const userDocRef = doc(db, "Users", user.email);
  
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const highestScore = userData.hscore || 0;
  
        if (currentScore > highestScore) {
          await setDoc(userDocRef, { hscore: currentScore, email: user.email }, { merge: true });
          setHighestScore(currentScore);
          console.log("Updated highest score in Firestore.");
        }
      } else {
        // Create a new document with the email as the document ID
        await setDoc(userDocRef, { hscore: currentScore, email: user.email });
        setHighestScore(currentScore);
        console.log("Created new user document in Firestore.");
      }
    } catch (error) {
      console.error("Error updating highest score in Firestore:", error);
    }
  };
  

  // Handle player's guess
  const handleGuess = (selectedArea) => {
    if (gameOver) return;

    if (meal && selectedArea === meal.country) {
      setFeedback("Correct! 🎉");
      setScore((prevScore) => prevScore + 1); // Increment score for correct guess
      fetchRandomMeal(); // Fetch a new random meal after a correct guess
    } else {
      setFeedback("Wrong! Try again.");
      setLives((prevLives) => {
        const updatedLives = prevLives - 1;
        if (updatedLives === 0) {
          setGameOver(true);
          updateHighestScore(score); // Update highest score when the game ends
        }
        return updatedLives;
      });

      setGuessedAreas((prev) => new Set([...prev, selectedArea]));
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
      <div>
        <Auth setUser={setUser} />
        {user && <p>Welcome, {user.email}. Highest Score: {highestScore}</p>}
      </div>
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
          <p>Score: {score}</p>
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
            <button
              key={area}
              onClick={() => handleGuess(area)}
              disabled={guessedAreas.has(area)}
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
