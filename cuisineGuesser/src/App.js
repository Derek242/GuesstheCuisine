import React, { useState, useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import QuizPage from "./components/QuizPage";
import "./App.css";
import { auth } from "./config/firebase"; // Firebase auth instance
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null); // Tracks the logged-in user
  const [loading, setLoading] = useState(true); // Indicates if the app is checking the auth state

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user if logged in, null otherwise
      setLoading(false); // Mark loading as complete
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, []);

  // Show a loading state while Firebase checks the user's auth state
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div> 
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<QuizPage user={user} />} /> {/* Landing page */}
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
        </Routes>
      </Router>
      </div>
    </MantineProvider>
  );
}

export default App;
