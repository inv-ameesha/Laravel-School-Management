import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import withRole from "../hoc/withRole";

const Sidebar = ({ items }) => {
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
  const NotificationsButton = withRole(
    () => (
      <button
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
        onClick={() => navigate("/notifications")}
      >
        Notifications
      </button>
    ),
    "admin"
  );

  const TeacherNotificationsButton = withRole(
    () => (
      <button
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
        onClick={() => navigate("/teacher-notifications")}
      >
        Notifications
      </button>
    ),
    "teacher"
  );

  if (items && Array.isArray(items)) {
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
        {items.map((item) => (
          <button
            key={item.path}
            style={{ display: "block", width: "100%", marginBottom: "10px" }}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </aside>
    );
  }

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
      <NotificationsButton />
      <TeacherNotificationsButton />
    </aside>
  );
};

export default Sidebar;
