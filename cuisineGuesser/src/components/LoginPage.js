// components/LoginPage.js
import React from "react";
import "./Login.css";
import { Auth } from "./auth"; // Import your existing Auth component
import { Text } from "@mantine/core";

const LoginPage = ({ setUser }) => {
  return (
    <div>
    <Text component="h1" style={{ color: "#FFD700" }}>
      Login
    </Text>
      <Auth setUser={setUser} />
    </div>
  );
};

export default LoginPage;
