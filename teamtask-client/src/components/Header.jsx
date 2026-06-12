import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

import { useNavigate, Link } from "react-router-dom";

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 15,
                borderBottom: "1px solid #ccc",
            }}>
            {/* LEFT */}
            <div style={{ display: "flex", gap: 15 }}>
                {!user && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                {user && (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/projects">Projects</Link>
                    </>
                )}
            </div>

            {/* CENTER */}
            <div>{user ? `${user.name} (${user.role})` : "Not logged in"}</div>

            {/* RIGHT */}
            <div style={{ display: "flex", gap: 10 }}>
                <button onClick={toggleTheme}>{theme === "light" ? "🌙 Dark" : "☀ Light"}</button>

                {user && <button onClick={handleLogout}>Logout</button>}
            </div>
        </div>
    );
}
