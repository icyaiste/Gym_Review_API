import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleLogin = () => {
    window.location.href = `${backendUrl}/login`;
  };

  const handleLogout = () => {
    window.location.href = `${backendUrl}/logout`;
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Login;
