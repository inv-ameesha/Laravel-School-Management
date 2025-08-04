import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from '../components/Layout';
const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    roll_number: "",
    class: "",
    dob: "",
    admission_date: "",
    status: "Active",
    teacher_id: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:8000/api/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching student:", err);
        setLoading(false);
      });
  }, [id]);
  console.log("Student ID from params:", id);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios.put(`http://localhost:8000/api/students/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        navigate("/students");
      })
      .catch((err) => {
        console.error("Update failed:", err);
      });
  };

  if (loading) return <p>Loading student data...</p>;

  return (
    <Layout>
    <div style={{ padding: "20px" }}>
      <h2>Edit Student</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="First Name"
        />
        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <input
          name="email"
          value={form.email}
          readOnly
          disabled
          placeholder="Email"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <input
          name="roll_number"
          value={form.roll_number}
          readOnly
          disabled
          placeholder="Roll Number"
        />
        <input
          name="class"
          value={form.class}
          onChange={handleChange}
          placeholder="Class"
        />
        <input
          name="dob"
          value={form.dob}
          onChange={handleChange}
          placeholder="Date of Birth"
        />
        <input
          name="admission_date"
          value={form.admission_date}
          onChange={handleChange}
          placeholder="Admission Date"
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <input
          name="teacher_id"
          value={form.teacher_id}
          onChange={handleChange}
          placeholder="Teacher ID"
        />
        <button type="submit">Save</button>
      </form>
    </div>
    </Layout>
  );
};

export default EditStudent;
