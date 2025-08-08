import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [messages, setMessages] = useState({ student: "", teacher: "", common: "" });
  const [notifications, setNotifications] = useState([]);
  const [editId, setEditId] = useState(null); // for editing

  useEffect(() => {
    fetchNotifications();
    setEditId(null);
    setMessages((prev) => ({ ...prev, [activeTab]: "" }));
  }, [activeTab]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/notifications?type=${activeTab}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleChange = (e) => {
    setMessages({ ...messages, [activeTab]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await api.put(`/notifications/${editId}`, {
          message: messages[activeTab],
        });
      } else {
        await api.post("/notifications", {
          type: activeTab,
          message: messages[activeTab],
        });
      }

      setMessages({ ...messages, [activeTab]: "" });
      setEditId(null);
      fetchNotifications();
    } catch (err) {
      console.error("Error saving notification:", err);
    }
  };

  const handleEdit = (id, message) => {
    setMessages({ ...messages, [activeTab]: message });
    setEditId(id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.put(`/notifications/${id}/publish`);
      fetchNotifications();
    } catch (err) {
      console.error("Publish failed", err);
    }
  };

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <h2>Notifications</h2>

        {/* Tab Buttons */}
        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => setActiveTab("student")} style={{ marginRight: "10px" }}>
            Student Notifications
          </button>
          <button onClick={() => setActiveTab("teacher")} style={{ marginRight: "10px" }}>
            Teacher Notifications
          </button>
          <button onClick={() => setActiveTab("common")}>
            Common Notifications
          </button>
        </div>

        {/* Form */}
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          <h3>{editId ? "Edit" : "New"} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notification</h3>
          <textarea
            rows={4}
            style={{ width: "100%", marginBottom: "10px" }}
            placeholder="Enter your message here..."
            value={messages[activeTab]}
            onChange={handleChange}
          />
          <br />
          <button onClick={handleSave}>{editId ? "Update" : "Save"}</button>
        </div>

        {/* Table */}
        {notifications.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <h4>Saved Notifications</h4>
            <table border="1" cellPadding="8" cellSpacing="0" width="100%">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Message</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.message}</td>
                    <td>{item.is_published ? "Yes" : "No"}</td>
                    <td>
                      <button onClick={() => handleEdit(item.id, item.message)}>Edit</button>
                      <button onClick={() => handleDelete(item.id)} style={{ marginLeft: "5px" }}>
                        Delete
                      </button>
                      {!item.is_published && (
                        <button onClick={() => handlePublish(item.id)} style={{ marginLeft: "5px" }}>
                          Publish
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
