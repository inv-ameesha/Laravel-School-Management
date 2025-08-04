import { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import Layout from '../components/Layout';

const AddTeacher = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    subject_specialization: '',
    employee_id: '',
    date_of_joining: '',
    status: 'Active',
    password: ''
  });

  const [successMessage, setSuccessMessage] = useState('');

  const mutation = useMutation({
    mutationFn: async (newTeacher) => {
      const token = localStorage.getItem('token');
      return await axios.post('http://127.0.0.1:8000/api/teachers', newTeacher, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      setSuccessMessage('Teacher added successfully!');
      // Reset the form
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        subject_specialization: '',
        employee_id: '',
        date_of_joining: '',
        status: 'Active',
        password: ''
      });
    },
    onError: (error) => {
      console.error('Error:', error?.response?.data);
      alert('Failed to add teacher');
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

      <h2>Add Teacher</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="phone_number"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          name="subject_specialization"
          placeholder="Subject Specialization"
          value={form.subject_specialization}
          onChange={handleChange}
          required
        />
        <input
          name="employee_id"
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={handleChange}
          required
        />
        <input
          name="date_of_joining"
          type="date"
          value={form.date_of_joining}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button type="submit" disabled={mutation.isLoading}>
          Add Teacher
        </button>
      </form>
    </div>
    </Layout>
  );
};

export default AddTeacher;
