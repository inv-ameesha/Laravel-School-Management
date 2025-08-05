import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
//useMutation - a hook from react query mutation to perform operations like PUT,POST,DELETE etc
import Layout from '../components/Layout';
import { AuthContext } from "../context/AuthContext";

const AddStudent = () => {
  const { user } = useContext(AuthContext);
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
    password: '',
  });

  const [teachers, setTeachers] = useState([]);//to store all the teachers
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // fetch all teachers only if user is admin
    const fetchTeachers = async () => {
      try {
        if(user.role === "admin") {
          const token = localStorage.getItem('token');
          const res = await axios.get('http://127.0.0.1:8000/api/teachers', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (Array.isArray(res.data)) {//if the response data is array 
            setTeachers(res.data);//set it to teachers state
          }
        }
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      }
    };

    fetchTeachers();
  }, [user.role]);

  useEffect(() => {
    if (user.role === "teacher") {
      // for teacher, set teacher_id automatically from user info
      setForm((prev) => ({ ...prev, teacher_id: user.teacher_id }));
    }
  }, [user]);

  const mutation = useMutation({
    //mutationFn : sends a post request to laravel to add a new student using token
    mutationFn: async (newStudent) => {
      const token = localStorage.getItem('token');
      return await axios.post('http://127.0.0.1:8000/api/students', newStudent, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      setSuccessMessage('Student added successfully!');//shows success msg
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
        teacher_id: user.role === "teacher" ? user.teacher_id : '', // keep teacher_id if teacher
        password: ''
      });
    },
    onError: (error) => {
      console.error('Error:', error?.response?.data);
      alert('Failed to add student');
    }
  });
  //hides the success msg after 3s
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (e) => {//when type something the form updtes with that current value
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
    //1.user action occured ; 
    //2.data from that action send to mutation func
    //3.mutation func will interact with the backend nd do operations required
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
        {/* Show teacher dropdown only for admin */}
        {user.role === "admin" && (
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
        )}

        <button type="submit" disabled={mutation.isLoading}>Add Student</button>
      </form>
    </div>
    </Layout>
  );
};

export default AddStudent;
