import React, { useState, useEffect } from "react";
import "./quiz.css";
import { Button, Box, Text, Center, Container, Tooltip} from "@mantine/core";
import { db } from "../config/firebase";
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";

function QuizPage({ user }) {
  const [meal, setMeal] = useState(null); // Stores the random meal
  const [areas, setAreas] = useState([]); // Stores all countries/areas
  const [feedback, setFeedback] = useState("");
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [guessedAreas, setGuessedAreas] = useState(new Set());
  const [highestScore, setHighestScore] = useState(0);
  const [correctCountry, setCorrectCountry] = useState(""); // For correct country
  const [foodName, setFoodName] = useState(""); // For food name
  const [clickedAreas, setClickedAreas] = useState(new Set());
  const [flagUrls, setFlagUrls] = useState({});


  useEffect(() => {
    fetchRandomMeal(); 
  }, []);
  
  // Define fetchRandomMeal here
  const fetchRandomMeal = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/random-meal");
      const data = await response.json();
      setMeal(data);
      setCorrectCountry(data.country); // Set correct country
      console.log(data.country);
      setFoodName(data.name); // Set food name
      console.log(data.country)
    } catch (error) {
      console.error("Error fetching meal:", error);
    }
  };
  
  // Fetch all areas
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/areas");
        const data = await response.json();
        setAreas(data);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };
    fetchAreas();
  }, []);
  
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
      setScore((prevScore) => prevScore + 1);
      fetchRandomMeal();
    } else {
      setFeedback("Wrong! Try again.");
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives === 0) {
          updateHighestScore(score); 
          setGameOver(true);
        }
        return newLives;
      });
      setGuessedAreas((prev) => new Set([...prev, selectedArea]));
    }
    setTimeout(() => {
      setFeedback("");
    }, 2000);
  };


  const restartGame = () => {
    setLives(5);
    setScore(0);
    setGameOver(false);
    setFeedback("");
    setGuessedAreas(new Set());
    fetchRandomMeal();
  };

  // Split countries into two halves
  const splitIndex = Math.ceil(areas.length / 2);
  const leftAreas = areas.slice(0, splitIndex);
  const rightAreas = areas.slice(splitIndex);

  
  const getFlagUrl = async (country) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/flag?country=${encodeURIComponent(country)}`
      );
      const data = await response.json();
  
      if (response.ok) {
        return data.flag; // Flag URL from backend
      } else {
        console.error("Error fetching flag:", data.error);
        return "https://via.placeholder.com/100?text=Flag+Not+Found";
      }
    } catch (error) {
      console.error("Network error fetching flag:", error);
      return "https://via.placeholder.com/100?text=Flag+Not+Found";
    }
  };

  useEffect(() => {
    const fetchFlags = async () => {
      const flags = {};
      for (const area of areas) {
        flags[area] = await getFlagUrl(area);
      }
      setFlagUrls(flags);
    };
  
    if (areas.length > 0) {
      fetchFlags();
    }
  }, [areas]);

  
  
  return (
    <Container className="quizcontainer">
      {/* Title and User Info */}
        <Text style={{ margin: 0, padding: 0 }} className="centertext">
          Guess The Cuisine
        </Text>
      {user ? (
        <Text style={{ margin: 0, padding: 0 }} >
          Welcome, {user.email}. Highest Score: {highestScore}
        </Text>
      ) : (
        <Text style={{ margin: 0, padding: 0 }}>
          You are playing as a guest. Scores will not be saved.
        </Text>
      )}

      {meal && !gameOver ? (
        <div className="quizbox">
          {/* Left Side Countries */}
          <div className="area">
              {leftAreas.map((area) => (
          <Tooltip  withArrow>
            <Button
              className="flag-button"
              style={{
                backgroundColor: "transparent",
                backgroundImage: !clickedAreas.has(area) && !guessedAreas.has(area)
                  ? `url(${flagUrls[area] || "https://via.placeholder.com/100?text=Flag+Not+Found"})`
                  : "none", // Use pre-fetched flag URL or fallback placeholder
                backgroundSize: "cover",
                color: "black",
                fontWeight: "bold",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                if (!clickedAreas.has(area)) e.target.style.backgroundImage = "none"; // Hide flag on hover
                setClickedAreas((prev) => new Set(prev).add(area));
              }}w
              onMouseLeave={() => {
                  setClickedAreas(new Set())
              }}
              onClick={(e) => {
                setClickedAreas(new Set())
                e.target.style.backgroundImage = "none";
                handleGuess(area); // Handle guess logic
              }}
              disabled={guessedAreas.has(area)}
            >
              {clickedAreas.has(area) || guessedAreas.has(area) ? area : ""}

            </Button>
          </Tooltip>
            ))}
          </div>

          {/* image */}
          <div className="centerimage">
            <Box
              className="image"
              component="img"
              src={meal.image}
              style={{ width: "100%", maxWidth:"500px", borderRadius: "50px" }}
            />
            <Text className="lives">
              Lives:{" "}
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ color: i < lives ? "red" : "gray" }}>
                  ♥
                </span>
              ))}
            </Text>
            <Text className="score">Score: {score}</Text>
            {gameOver && (
              <Button onClick={restartGame} color="red">
                Restart Game
              </Button>
            )}
          </div>

          {/* Right Side Countries */}
          <div className="area">
              {rightAreas.map((area) => (
              <Tooltip  withArrow>
                <Button
              className="flag-button"
              style={{
                backgroundColor: "transparent",
                backgroundImage: !clickedAreas.has(area) && !guessedAreas.has(area)
                  ? `url(${flagUrls[area] || "https://via.placeholder.com/100?text=Flag+Not+Found"})`
                  : "none", // Use pre-fetched flag URL or fallback placeholder
                backgroundSize: "cover",
                color: "black",
                fontWeight: "bold",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                if (!clickedAreas.has(area)) e.target.style.backgroundImage = "none"; // Hide flag on hover
                setClickedAreas((prev) => new Set(prev).add(area));
              }}w
              onMouseLeave={() => {
                  setClickedAreas(new Set())
              }}
              onClick={(e) => {
                setClickedAreas(new Set())
                e.target.style.backgroundImage = "none";
                handleGuess(area); // Handle guess logic
              }}
              disabled={guessedAreas.has(area)}
            >
              {clickedAreas.has(area) || guessedAreas.has(area) ? area : ""}

            </Button>
              </Tooltip>
            ))}
          </div>
        </div>
      ) : gameOver ? (
        <Center className="gameover">
          <Text size="xl" weight={700} color="red">
            Game Over!
          </Text>
          <Text size="lg" weight={500}>
            The correct country was: <strong>{correctCountry}</strong>
          </Text>
          <Text size="lg" weight={500}>
            The name of the dish is: <strong>{foodName}</strong>
          </Text>
          <Button color="red" onClick={restartGame} mt="md">
            Restart Game
          </Button>
        </Center>
      ) : (
        <Center>
          <Text>Loading meal...</Text>
        </Center>
      )}
      {feedback && (
        <div className="popup">
          <Text>{feedback}</Text>
        </div>
      )}
    </Container>
  );
}

export default QuizPage;
