import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]); // must start as array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Reached ", res.data);
        if (Array.isArray(res.data)) {
          setTeachers(res.data);
        } else {
          console.error("Expected an array but got:", res.data);
          setTeachers([]); // fallback to empty
        }
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
        setTeachers([]); // fallback to empty
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <div>
        <h2>Teacher List</h2>
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Employee ID</th>
              <th>Date of Joining</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={teacher.id}>
                <td>{index + 1}</td>
                <td>{teacher.first_name}</td>
                <td>{teacher.last_name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.phone_number}</td>
                <td>{teacher.subject_specialization}</td>
                <td>{teacher.employee_id}</td>
                <td>{teacher.date_of_joining}</td>
                <td>{teacher.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default TeacherList;
