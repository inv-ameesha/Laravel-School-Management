import { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import Layout from '../components/Layout';

const AddStudent = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    roll_number: '',
    class: '',
    dob: '',
    admission_date: '',
    status: 'Active',
    teacher_id: '',
    password: ''
  });

  const [teachers, setTeachers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8000/api/teachers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(res.data)) {
          setTeachers(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  const mutation = useMutation({
    mutationFn: async (newStudent) => {
      const token = localStorage.getItem('token');
      return await axios.post('http://127.0.0.1:8000/api/students', newStudent, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      setSuccessMessage('Student added successfully!');
      // Reset form
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        roll_number: '',
        class: '',
        dob: '',
        admission_date: '',
        status: 'Active',
        teacher_id: '',
        password: ''
      });
    },
    onError: (error) => {
      console.error('Error:', error?.response?.data);
      alert('Failed to add student');
    }
  });

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <Layout>
    <div>
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#4BB543',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          zIndex: 1000,
        }}>
          {successMessage}
        </div>
      )}

      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
          value={form.first_name}
          required
        />
        <input
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
          value={form.last_name}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          value={form.phone}
          required
        />
        <input
          name="roll_number"
          placeholder="Roll Number"
          onChange={handleChange}
          value={form.roll_number}
          required
        />
        <input
          name="class"
          placeholder="Class/Grade"
          onChange={handleChange}
          value={form.class}
          required
        />
        <input
          name="dob"
          type="date"
          onChange={handleChange}
          value={form.dob}
          required
        />
        <input
          name="admission_date"
          type="date"
          onChange={handleChange}
          value={form.admission_date}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          required
        />
        <select
          name="status"
          onChange={handleChange}
          value={form.status}
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          name="teacher_id"
          onChange={handleChange}
          value={form.teacher_id}
          required
        >
          <option value="">-- Select Teacher --</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.first_name} {teacher.last_name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={mutation.isLoading}>Add Student</button>
      </form>
    </div>
    </Layout>
  );
};

export default AddStudent;
