import { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import Layout from '../components/Layout';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import api from '../api/axios';
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
      return await api.post('/teachers', newTeacher);
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
  const validateForm = () => {
    if (!/^[A-Za-z\s]+$/.test(form.first_name)) {
      alert('First name should contain only letters');
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(form.last_name)) {
      alert('Last name should contain only letters');
      return false;
    }
    if (!/^\d{10}$/.test(form.phone_number)) {
      alert('Phone number must be 10 digits');
      return false;
    }
    if (form.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate(form);
    }
  };

  return (
    <Layout>
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Add Teacher
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            name="first_name"
            fullWidth
            margin="normal"
            value={form.first_name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Last Name"
            name="last_name"
            fullWidth
            margin="normal"
            value={form.last_name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Phone Number"
            name="phone_number"
            fullWidth
            margin="normal"
            value={form.phone_number}
            onChange={handleChange}
            required
          />
          <TextField
            label="Subject Specialization"
            name="subject_specialization"
            fullWidth
            margin="normal"
            value={form.subject_specialization}
            onChange={handleChange}
            required
          />
          <TextField
            label="Employee ID"
            name="employee_id"
            fullWidth
            margin="normal"
            value={form.employee_id}
            onChange={handleChange}
            required
          />
          <TextField
            label="Date of Joining"
            name="date_of_joining"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={form.date_of_joining}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
          />
          <TextField
            label="Status"
            name="status"
            select
            fullWidth
            margin="normal"
            value={form.status}
            onChange={handleChange}
            required
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={mutation.isLoading}
            sx={{ mt: 2 }}
          >
            {mutation.isLoading ? 'Adding...' : 'Add Teacher'}
          </Button>
        </form>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default AddTeacher;
