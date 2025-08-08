import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
} from "@mui/material";

const Login = () => {
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", formData);
      console.log("Login response:", res.data);

      const accessToken = res.data.access_token;

      setToken(accessToken);
      const loggedInUser = {
        id: res.data.user_id,
        teacher_id: res.data.teacher_id,
        name: res.data.user_name,
        email: res.data.user_email,
        role: res.data.user_role,
      };
      setUser(loggedInUser);
      try {
        let notifRes;
        if (res.data.user_role === "teacher") {
          notifRes = await axios.get(
            "http://127.0.0.1:8000/api/unread-notifications",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        } else if (res.data.user_role === "student") {
          notifRes = await axios.get(
            "http://127.0.0.1:8000/api/student-unread-notifications",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        }

        const data = notifRes?.data || [];
        if (data.length > 0) {
          const messages = data
            .map((n, index) => `${index + 1}. ${n.message}`)
            .join("\n");
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("New Notifications", {
              body: messages,
            });
          } else {
            console.log("New Notifications:\n" + messages);
          }
        }
        // Add: Mark all as read button for students
        if (res.data.user_role === "student" && data.length > 0) {
          window.markAllAsRead = async function () {
            for (const notif of data) {
              await axios.post(
                `http://127.0.0.1:8000/api/mark-as-read/${notif.id}`,
                {},
                {
                  headers: { Authorization: `Bearer ${accessToken}` },
                }
              );
            }
            alert("All notifications marked as read!");
          };
        }
      } catch (notifErr) {
        console.error("Notification fetch error:", notifErr);
      }

      if (res.data.user_role === "admin" || res.data.user_role === "teacher") {
        navigate("/home");
      } else if (res.data.user_role === "student") {
        navigate("/student-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 10 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
