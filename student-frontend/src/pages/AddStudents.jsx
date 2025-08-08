import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
//useMutation - a hook from react query mutation to perform operations like PUT,POST,DELETE etc
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  FormControl,
  InputLabel,
} from "@mui/material";
import api from "../api/axios";
const AddStudent = () => {
  const { user } = useContext(AuthContext);
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
    password: "",
  });

  const [teachers, setTeachers] = useState([]); //to store all the teachers
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // fetch all teachers only if user is admin
    const fetchTeachers = async () => {
  try {
    if (user.role === "admin") {
      const res = await api.get("/teachers");

      if (Array.isArray(res.data)) {
        setTeachers(res.data);
      }
    }
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
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
  //mutation handles react state automatically like onSuccess,error etc
  const mutation = useMutation({
    //mutationFn : sends a post request to laravel to add a new student using token
    mutationFn: async (newStudent) => {
      return await api.post('/students', newStudent);
    },
    onSuccess: () => {
      setSuccessMessage("Student added successfully!"); //shows success msg
      // Reset form
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        roll_number: "",
        class: "",
        dob: "",
        admission_date: "",
        status: "Active",
        teacher_id: user.role === "teacher" ? user.teacher_id : "", // keep teacher_id if teacher
        password: "",
      });
    },
    onError: (error) => {
      console.error("Error:", error?.response?.data);
      alert("Failed to add student");
    },
  });
  //hides the success msg after 3s
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (e) => {
    //when type something the form updtes with that current value
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const validateForm = () => {
    const {
      first_name,
      last_name,
      email,
      phone,
      roll_number,
      class: classGrade,
      dob,
      admission_date,
      status,
      password,
      teacher_id,
    } = form;

    if (!first_name.trim() || first_name.length > 255) {
      alert("First name is required and must be less than 255 characters");
      return false;
    }

    if (!last_name.trim() || last_name.length > 255) {
      alert("Last name is required and must be less than 255 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      alert("A valid email is required");
      return false;
    }

    if (!phone.trim() || phone.length > 20) {
      alert("Phone is required and must be less than 20 characters");
      return false;
    }

    if (!roll_number.trim()) {
      alert("Roll number is required");
      return false;
    }

    if (!classGrade.trim() || classGrade.length > 100) {
      alert("Class is required and must be less than 100 characters");
      return false;
    }

    if (!dob) {
      alert("Date of birth is required");
      return false;
    }

    if (!admission_date) {
      alert("Admission date is required");
      return false;
    }

    if (!password || password.length < 6) {
      alert("Password is required and must be at least 6 characters");
      return false;
    }

    if (!["Active", "Inactive"].includes(status)) {
      alert("Status must be Active or Inactive");
      return false;
    }

    if (user.role === "admin" && !teacher_id) {
      alert("Please select a teacher");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    mutation.mutate(form);
    //1.user action occured ;
    //2.data from that action send to mutation func
    //3.mutation func will interact with the backend and do operations required
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 4,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "white",
          }}
        >
          <div>
            {successMessage && (
              <div
                style={{
                  position: "fixed",
                  top: "20px",
                  right: "20px",
                  backgroundColor: "#4BB543",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  zIndex: 1000,
                }}
              >
                {successMessage}
              </div>
            )}

            <Typography variant="h5" align="center" gutterBottom>
              Add Student
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
                label="Phone"
                name="phone"
                fullWidth
                margin="normal"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <TextField
                label="Roll Number"
                name="roll_number"
                fullWidth
                margin="normal"
                value={form.roll_number}
                onChange={handleChange}
                required
              />
              <TextField
                label="Class/Grade"
                name="class"
                fullWidth
                margin="normal"
                value={form.class}
                onChange={handleChange}
                required
              />
              <TextField
                label="Date of Birth"
                name="dob"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={form.dob}
                onChange={handleChange}
                required
              />
              <TextField
                label="Admission Date"
                name="admission_date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={form.admission_date}
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
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={form.status}
                  label="Status"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              {/* Show teacher dropdown only for admin */}
              {user.role === "admin" && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Assign Teacher</InputLabel>
                  <Select
                    name="teacher_id"
                    value={form.teacher_id}
                    onChange={handleChange}
                    required
                    label="Assign Teacher"
                  >
                    <MenuItem value="">-- Select Teacher --</MenuItem>
                    {teachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.first_name} {teacher.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={mutation.isLoading}
              >
                Add Student
              </Button>
            </form>
          </div>
        </Box>
      </Container>
    </Layout>
  );
};

export default AddStudent;
