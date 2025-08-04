import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = React.useContext(AuthContext);

  return (
    <header style={{
      height: "60px",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 20px",
      borderBottom: "1px solid #ccc",
      boxSizing: "border-box",
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "#fff",
      zIndex: 1000,
    }}>
      <h2>Welcome, {user?.name || "User"}!</h2>
      <button onClick={logout}>Logout</button>
    </header>
  );
};


export default Header;
