import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
import Layout from "../components/Layout";
const EditTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    subject_specialization: "",
    employee_id: "",
    date_of_joining: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/teachers/${id}`)
      .then((res) => {
        console.log("API response:", res.data);
        setForm(res.data.data || res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching teacher:", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put(`/teachers/${id}`, form)
      .then(() => {
        navigate("/teachers");
      })
      .catch((err) => {
        console.error("Update failed:", err);
      });
  };

  if (loading) return <p>Loading teacher data...</p>;

  return (
    <Layout>
    <div style={{ padding: "20px" }}>
      <h2>Edit Teacher</h2>
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
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        <input
          name="subject_specialization"
          value={form.subject_specialization}
          onChange={handleChange}
          placeholder="Subject Specialization"
        />
        <input
          name="employee_id"
          value={form.employee_id}
          readOnly
          disabled
          placeholder="Employee ID"
        />
        <input
          name="date_of_joining"
          value={form.date_of_joining}
          onChange={handleChange}
          placeholder="Date of Joining"
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button type="submit">Save</button>
      </form>
    </div>
    </Layout>
  );
};

export default EditTeacher;
