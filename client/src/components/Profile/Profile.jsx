import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/profile", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  if (loading)
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ backgroundColor: "#eee", height: 64, width: 64, borderRadius: "50%" }} />
          <div style={{ flex: 1 }}>
            <div style={{ backgroundColor: "#eee", height: 16, width: "60%", borderRadius: 4 }} />
            <div style={{ height: 8 }} />
            <div style={{ backgroundColor: "#eee", height: 12, width: "40%", borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ backgroundColor: "#eee", height: 100, width: "100%", borderRadius: 8 }} />
      </div>
    );
  if (!user) return <p>Not logged in.</p>;
  return (
    <div>
      <h2>Hello {user.given_name || user.name}</h2>
      {user.email && <p>{user.email}</p>}
      {user.picture && (
        <img
          src={user.picture}
          alt={user.name}
          style={{ width: 80, borderRadius: "50%" }}
        />
      )}
      <div style={{ marginTop: 12 }}>
        <a href="http://localhost:3000/logout" onClick={(e) => {
          e.preventDefault();
          window.location.href = "http://localhost:3000/logout";
        }}>Log out</a>
      </div>
    </div>
  );
};

export default Profile;
