import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import usePushNotifications from "../hooks/usePushNotifications";
import Layout from "../components/Layout";

const TeacherNotifications = () => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  usePushNotifications(); // Enable push notifications

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/my-notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(response.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/mark-as-read/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, status: "read" } : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  return (
    <Layout>
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        My Notifications
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto", mt: 3 }} />
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : notifications.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No notifications available.
        </Alert>
      ) : (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Message</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((notif,index) => (
                <TableRow key={notif.id}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{notif.message}</TableCell>
                  <TableCell>{notif.status}</TableCell>
                  <TableCell>
                    {notif.status === "unread" && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        style={{ padding: "4px 8px" }}
                      >
                        Mark as Read
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
    </Layout>
  );
};

export default TeacherNotifications;
