import { useEffect , useState , useContext} from "react";
//useDispatch : lets you to send actions to Redux store
//useSelector : allows to access redux store
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../redux/StudentsSlice";
import Layout from "../components/Layout";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {AuthContext } from "../context/AuthContext";
const StudentList = () => {
   const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  //access students slice from redux state
  //list : student objects 
  const { list, loading } = useSelector((state) => state.students);

  useEffect(() => {//runs once the component mounts
    dispatch(fetchStudents());//student data loads
  }, [dispatch]);//[dispatch] : default dependancy array of useeffect hook: once changed data loads

  const handleEdit = (studentId) => {
    navigate(`/edit-student/${studentId}`);
  };

  const handleDelete = async (studentId) => {//soft delete 
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      await axios.put(//instead of delete the status changed from active to inactive
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
      dispatch(fetchStudents()); //it refreshes the students list
    } catch (err) {
      console.error("Delete (status update) failed:", err);
      alert("Failed to delete student");
    }
  };

  if (loading) return <p>Loading...</p>;
 const filteredList =
    user?.role === "teacher"
      ? list.filter((student) => student.teacher_id === user.teacher_id)
      : list;

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredList.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredList.length / studentsPerPage);
  const displayPage = totalPages === 0 ? 0 : currentPage;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };
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
          {currentStudents.map((student, index) => (
            <tr key={student.id}>
              <td>{indexOfFirstStudent + index + 1}</td>
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
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <a href="#" className="w3-button" onClick={handlePrevPage}>
          &laquo;
        </a>
        <span style={{ margin: "0 15px" }}>
          Page {displayPage} of {totalPages}
        </span>
        <a href="#" className="w3-button" onClick={handleNextPage}>
          &raquo;
        </a>
      </div>
    </Layout>
  );
};

export default StudentList;
