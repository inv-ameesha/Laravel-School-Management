import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);//give access to values provided by authprovider
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    // Navigate to login page, replace current history entry
    navigate("/", { replace: true });

    //pushes the duplicate entry of current page URL TO Prevent back button navigation
    window.history.pushState(null, "", window.location.href);

    // listen to back button and re-push state 
    const onPopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", onPopState);//listens to back button event click, if clicked popstate called

    // Remove event listener after 1 min to avoid memory leaks
    setTimeout(() => {
      window.removeEventListener("popstate", onPopState);
    }, 1000);
  };

  return (
    <header
      style={{
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
      }}
    >
      <h2>Welcome, {user?.name || "User"}!</h2>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;
