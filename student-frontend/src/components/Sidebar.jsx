import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import withRole from "../hoc/withRole";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // HOC-wrapped buttons
  const ViewTeachersButton = withRole(
    () => (
      <button
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
        onClick={() => navigate("/teachers")}
      >
        View Teachers
      </button>
    ),
    "admin"
  );

  const AddTeacherButton = withRole(
    () => (
      <button
        style={{ display: "block", width: "100%" }}
        onClick={() => navigate("/add-teacher")}
      >
        Add Teacher
      </button>
    ),
    "admin"
  );

  return (
    <aside
      style={{
        paddingTop: "100px",
        width: "200px",
        borderRight: "1px solid #ccc",
        height: "100vh",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <button
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
        onClick={() => navigate("/students")}
      >
        View Students
      </button>
      <ViewTeachersButton />
      <AddTeacherButton />
      <button
        style={{ display: "block", width: "100%", marginTop: "10px" }}
        onClick={() => navigate("/add-student")}
      >
        Add Student
      </button>
    </aside>
  );
};

export default Sidebar;
