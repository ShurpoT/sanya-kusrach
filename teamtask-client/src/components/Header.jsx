import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Header.module.css"; // Импорт стилей

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className={styles.header}>
            <div className={styles.leftGroup}>
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

            <div>{user ? `${user.name} (${user.role})` : "Not logged in"}</div>

            <div className={styles.rightGroup}>
                <button onClick={toggleTheme}>{theme === "light" ? "🌙 Dark" : "☀ Light"}</button>
                {user && <button onClick={handleLogout}>Logout</button>}
            </div>
        </div>
    );
}
