import { useState, useEffect } from "react";
import axios from "axios";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/notifications/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/notifications/${id}/read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.patch(
        "http://127.0.0.1:8000/api/notifications/mark-all-read/",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "relative",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.5rem",
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              fontSize: "0.7rem",
              padding: "2px 5px",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Feed */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "110%",
            width: "320px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 14px",
              borderBottom: "1px solid #eee",
            }}
          >
            <strong>Notifications</strong>
            <button
              onClick={markAllRead}
              style={{
                fontSize: "0.75rem",
                color: "#007bff",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Mark all read
            </button>
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <p style={{ padding: "14px", color: "#888", textAlign: "center" }}>
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                style={{
                  padding: "12px 14px",
                  borderBottom: "1px solid #f0f0f0",
                  background: n.is_read ? "white" : "#f0f7ff",
                  cursor: "pointer",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: n.is_read ? "normal" : "bold",
                    fontSize: "0.9rem",
                  }}
                >
                  {n.title}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#555" }}>
                  {n.message}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "0.7rem", color: "#aaa" }}>
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}