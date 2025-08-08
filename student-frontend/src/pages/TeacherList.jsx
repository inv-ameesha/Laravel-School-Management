import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
const TeacherList = () => {
  const [teachers, setTeachers] = useState([]); //state to store the fetched teacher's data
  const [loading, setLoading] = useState(true); //to check whether data is loading/not
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 2;
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   axios
  //     .get("http://localhost:8000/api/teachers", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => {
  //       setTeachers(res.data); //once obtained set the obtained data
  //       setLoading(false); //now make loading false,bcz data received
  //     })
  //     .catch((err) => {
  //       console.error("Failed to fetch teachers:", err);
  //       setLoading(false);
  //     });
  // }, []); //[] : means the component runs only once its loaded
  useEffect(() => {
    api
      .get('/teachers') // No need to manually add headers
      .then((res) => {
        setTeachers(res.data);
        console.log(res.data);
        
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch teachers:', err);
        setLoading(false);
      });
  }, []);
  const handleEdit = (id) => {
    navigate(`/edit-teacher/${id}`);
  };

  const handleDelete = (id) => {
    axios
      .put(`http://localhost:8000/api/teachers/${id}/status`, {
        status: "Inactive",
      })
      .then(() => {
        //updation done by removing all the deleted teachers from the list , no refetch
        setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
      })
      .catch((err) => {
        console.error("Delete failed:", err);
      });
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) return <p>Loading...</p>;
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = teachers.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
  );
  const totalPages = Math.ceil(teachers.length / teachersPerPage);
  return (
    <Layout>
      <h2>Teacher List</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Subject</th>
            <th>Employee ID</th>
            <th>Date of Joining</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTeachers?.length>0&&currentTeachers?.map((teacher, index) => (
            <tr key={teacher.id}>
              <td>{indexOfFirstTeacher + index + 1}</td>
              <td>
                {teacher.first_name} {teacher.last_name}
              </td>
              <td>{teacher.email}</td>
              <td>{teacher.phone_number}</td>
              <td>{teacher.subject_specialization}</td>
              <td>{teacher.employee_id}</td>
              <td>{teacher.date_of_joining}</td>
              <td>{teacher.status}</td>
              <td>
                <button onClick={() => handleEdit(teacher.id)}>✏️</button>
                <button onClick={() => handleDelete(teacher.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          paddingLeft: "370px",
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="w3-button"
        >
          &laquo;
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="w3-button"
        >
          &raquo;
        </button>
      </div>
    </Layout>
  );
};
export default TeacherList;
