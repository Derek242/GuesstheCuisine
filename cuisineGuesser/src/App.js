import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [meal, setMeal] = useState(null);  // Stores the random meal
    const [areas, setAreas] = useState([]);  // Stores all countries/areas
    const [feedback, setFeedback] = useState('');  // Stores feedback for the player

    // Fetch the random meal when the component mounts
    useEffect(() => {
        fetch('http://localhost:5000/api/random-meal')
            .then((response) => response.json())
            .then((data) => {
                console.log('Meal fetched:', data);  // Check what data is logged here
                setMeal(data);
            })
            .catch((error) => console.error('Error fetching meal:', error));
    }, []);

    // Fetch the list of areas when the component mounts
    useEffect(() => {
        fetch('http://localhost:5000/api/areas')
            .then((response) => response.json())
            .then((data) => setAreas(data))
            .catch((error) => console.error('Error fetching areas:', error));
    }, []);

    // Handle player's guess
    const handleGuess = (selectedArea) => {
        if (meal && selectedArea === meal.country) {
            setFeedback('Correct! 🎉');
        } else {
            setFeedback('Wrong! Try again.');
        }
    };

    return (
        <div>
            <h1>Food Guesser Game</h1>
            {meal ? (
                <div>
                    <img src={meal.image} alt="Random Meal" style={{ width: '300px', height: '300px' }} />
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
