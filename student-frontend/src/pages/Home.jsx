import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div>
      <Header />
      <div style={{ display: "flex", height: `calc(100vh - 60px)`,paddingTop:"60px" }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: "20px"}}>
          <h1>Dashboard Content</h1>
        </main>
      </div>
    </div>
  );
};

export default Home;
