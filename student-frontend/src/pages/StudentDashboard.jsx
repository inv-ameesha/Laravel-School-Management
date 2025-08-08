import React from "react";
import Layout from "../components/Layout";
import { Container, Typography, Paper } from "@mui/material";
import StudentNotifications from "./StudentNotifications";

const StudentDashboard = () => {
  return (
    <Layout sidebarItems={[{ label: "Notifications", path: "/student-notifications" }]}> 
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom align="center">
          Student Dashboard
        </Typography>
        <Paper sx={{ mt: 2, p: 2 }}>
          <StudentNotifications />
        </Paper>
      </Container>
    </Layout>
  );
};

export default StudentDashboard;
