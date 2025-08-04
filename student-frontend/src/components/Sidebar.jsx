import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside style={{
      paddingTop:"100px",
      width: "200px",
      borderRight: "1px solid #ccc",
      height: "100vh",
      padding: "20px",
      boxSizing: "border-box",
    }}>
      <button
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
        onClick={() => navigate("/students")}
      >
        View Students
      </button>
      <button
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
        onClick={() => navigate("/teachers")}
      >
        View Teachers
      </button>
      <button
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
        onClick={() => navigate("/add-student")}
      >
        Add Student
      </button>
      <button
        style={{ display: "block", width: "100%" }}
        onClick={() => navigate("/add-teacher")}
      >
        Add Teacher
      </button>
    </aside>
  );
};

export default Sidebar;
