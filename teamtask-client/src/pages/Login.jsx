import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await api.post("/auth/login", {
                email,
                password,
            });

            login(res.data);
            navigate("/projects");

            alert("Logged in!");
        } catch (err) {
            alert(err.response?.data?.message);
        }
    };

    return (
        <div className="form-container">
            <div className="form">
                <h2>Login</h2>

                <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />

                <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />

                <button onClick={handleLogin}>Login</button>
                <p style={{ marginTop: 10 }}>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}
