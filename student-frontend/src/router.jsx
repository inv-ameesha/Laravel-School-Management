import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import StudentList from "./pages/StudentsList";
import TeacherList from "./pages/TeacherList";
import AddStudent from "./pages/AddStudents";
import AddTeacher from "./pages/AddTeachers";
import EditStudent from "./pages/EditStudent";
import EditTeacher from "./pages/EditTeacher";
import Notifications from "./pages/Notifications";
import TeacherNotifications from "./pages/TeacherNotifications";
import StudentDashboard from "./pages/StudentDashboard";
import StudentNotifications from "./pages/StudentNotifications";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/students",
    element: <StudentList />,
  },
  {
    path: "/teachers",
    element: <TeacherList />,
  },
  {
    path: "/add-student",
    element: <AddStudent />,
  },
  {
    path: "/add-teacher",
    element: <AddTeacher />,
  },
  {
    path: "/edit-student/:id",
    element: <EditStudent />,
  },
  {
    path: "/edit-teacher/:id",
    element: <EditTeacher />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/teacher-notifications",
    element: <TeacherNotifications />,
  },
  {
    path: "/my-notifications",
    element: <TeacherNotifications />,
  },
  {
    path: "/student-dashboard",
    element: <StudentDashboard />,
  },
  {
    path: "/student-notifications",
    element: <StudentNotifications />,
  },
]);

export default router;
