import { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await axios.get(`${backendUrl}/gyms`);
        setGyms(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGyms();
  }, [backendUrl]);

  if (loading) return <p>Loading gyms...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>🏋️ Gym Reviews</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {gyms.map((gym) => (
          <div
            key={gym.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={gym.image}
              alt={gym.name}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <div style={{ padding: "16px" }}>
              <h3>{gym.name}</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>
                📍 {gym.location}
              </p>
              <p style={{ fontSize: "14px" }}>{gym.description || "No description"}</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                <span style={{ fontWeight: "bold" }}>{gym.price}</span>
                <span>⭐ {gym.rating.toFixed(1)} ({gym.reviewCount} reviews)</span>
              </div>
              <button
                style={{
                  marginTop: "12px",
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
