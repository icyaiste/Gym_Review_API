import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app with Auth0, you would exchange the authorization code for tokens here
    // and store them (e.g., in localStorage or context)
    // For now, we'll just redirect to home after a short delay
    const timer = setTimeout(() => {
      navigate("/");
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <p>Processing login...</p>
    </div>
  );
};

export default Callback;
