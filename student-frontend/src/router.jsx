import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import StudentList from "./pages/StudentsList";
import TeacherList from "./pages/TeacherList";
import AddStudent from "./pages/AddStudents";
import AddTeacher from "./pages/AddTeachers";
import EditStudent from "./pages/EditStudent";
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
]);

export default router;
