import React, { useEffect, useState } from "react";
import notificationSound from "../assets/notification.mp3";
import { API_BASE_URL } from "../config";

function Notifications() {

  const [notifications, setNotifications] = useState([]);
  const [previousCount, setPreviousCount] = useState(0);
  const [openMenu, setOpenMenu] = useState(null);

  /* =========================
     FETCH NOTIFICATIONS
  ========================== */

  const fetchNotifications = () => {

    fetch(`${API_BASE_URL}/notifications`)
      .then(res => res.json())
      .then(data => {

        if (
          data.length > previousCount &&
          previousCount !== 0
        ) {
          const audio =
            new Audio(notificationSound);
          audio.play();
        }

        setPreviousCount(data.length);
        setNotifications(data);

      })
      .catch(err =>
        console.log("Fetch error:", err)
      );

  };

  useEffect(() => {

    fetchNotifications();

    const interval =
      setInterval(fetchNotifications, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  /* =========================
     DELETE NOTIFICATION
  ========================== */

  const deleteNotification = async (id) => {

  try {

    console.log("Deleting ID:", id);

    const response = await fetch(
      `${API_BASE_URL}/delete-notification/${id}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    console.log("Delete response:", data);

    if (response.ok) {

      // remove from UI immediately
      setNotifications(prev =>
        prev.filter(n => n.id !== id)
      );

      alert("Notification deleted");

    } else {

      alert("Delete failed");

    }

  } catch (error) {

    console.log("Delete error:", error);

    alert("Delete error");

  }

};

  return (

    <div style={{ padding: "40px" }}>

      <h2>Farmer Notifications</h2>

      {notifications.length === 0 ? (

        <p>No notifications available</p>

      ) : (

        notifications.map((note, index) => (

          <div
            key={note.id}
            style={cardStyle}
          >

            {/* THREE DOT MENU */}

            <div style={menuWrapper}>

              <span
                style={dotsStyle}
                onClick={() =>
                  setOpenMenu(
                    openMenu === index
                      ? null
                      : index
                  )
                }
              >
                ⋮
              </span>

              {openMenu === index && (

                <div style={dropdownMenu}>

                  <div
                    style={deleteStyle}
                    onClick={() => deleteNotification(note.id)}
                  >
                    🗑 Delete Notification
                  </div>

                </div>

              )}

            </div>

            {/* MESSAGE */}

            <div
              style={{
                whiteSpace:
                  "pre-line"
              }}
            >
              {note.message}
            </div>

          </div>

        ))

      )}

    </div>

  );

}

/* ================= STYLES ================= */

const cardStyle = {
  background: "#ffffff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  marginBottom: "25px",
  position: "relative"
};

const menuWrapper = {
  position: "absolute",
  top: "15px",
  right: "15px"
};

const dotsStyle = {
  fontSize: "20px",
  cursor: "pointer",
  fontWeight: "bold"
};

const dropdownMenu = {
  position: "absolute",
  top: "30px",
  right: "0",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
  padding: "10px",
  zIndex: 10
};

const deleteStyle = {
  color: "red",
  fontWeight: "600",
  cursor: "pointer"
};

export default Notifications;