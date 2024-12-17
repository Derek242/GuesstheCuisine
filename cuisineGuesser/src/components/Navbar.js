import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        color: "#F4BB44",
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            fontWeight: "bold",
            color: "#F4BB44",
            fontSize: "1.8rem",
            padding: "5px 10px",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#555")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          Quiz
        </Link>
        <Link
          to="/login"
          style={{
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.8rem",
            color: "#F4BB44",
            padding: "5px 10px",
            borderRadius: "4px",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#555")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          Login/Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
