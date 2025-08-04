import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../redux/StudentsSlice";
import Layout from "../components/Layout";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const StudentList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleEdit = (studentId) => {
    navigate(`/edit-student/${studentId}`);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      await axios.put(
        `http://localhost:8000/api/students/${studentId}`,
        {
          status: "Inactive",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(fetchStudents()); 
    } catch (err) {
      console.error("Delete (status update) failed:", err);
      alert("Failed to delete student");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <h2>Student List</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Roll Number</th>
            <th>Class</th>
            <th>Date of Birth</th>
            <th>Admission Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>
              <td>{student.roll_number}</td>
              <td>{student.class}</td>
              <td>{student.dob}</td>
              <td>{student.admission_date}</td>
              <td>{student.status}</td>
              <td>
                <FaEdit
                  style={{
                    cursor: "pointer",
                    marginRight: "10px",
                    color: "blue",
                  }}
                  onClick={() => handleEdit(student.id)}
                  title="Edit"
                />
                <FaTrash
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => handleDelete(student.id)}
                  title="Delete"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default StudentList;
