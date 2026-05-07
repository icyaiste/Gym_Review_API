import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div style={{ display: "flex", gap: "20px", padding: "16px", backgroundColor: "#f8f9fa", borderBottom: "1px solid #ddd" }}>
            <Link to="/" style={{ textDecoration: "none", fontWeight: "bold", fontSize: "18px" }}>🏋️ Gym Reviews</Link>
            <div style={{ marginLeft: "auto", display: "flex", gap: "20px" }}>
                <Link to="/" style={{ textDecoration: "none" }}>Home</Link>
                <Link to="/profile" style={{ textDecoration: "none" }}>Profile</Link>
                <Link to="/login" style={{ textDecoration: "none" }}>Login</Link>
            </div>
        </div>
    );
};

export default Header;