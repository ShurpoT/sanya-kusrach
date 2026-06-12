import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleRegister = async () => {
        try {
            setError("");

            await api.post("/auth/register", {
                name,
                email,
                password,
            });

            alert("User created successfully");

            // после регистрации ведем на login
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Error");
        }
    };

    return (
        <div className="form-container">
            <div style={{ padding: 20, maxWidth: 400 }}>
                {/* Заменили общий div на форму и добавили onSubmit */}
                <form
                    className="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleRegister();
                    }}>
                    <h2>Register</h2>
                    <input
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ display: "block", marginBottom: 10, width: "100%" }}
                    />

                    <input
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ display: "block", marginBottom: 10, width: "100%" }}
                    />

                    <input
                        type="password"
                        required
                        autoComplete="new-password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ display: "block", marginBottom: 10, width: "100%" }}
                    />

                    {/* Изменили тип кнопки на submit */}
                    <button type="submit" style={{ width: "100%" }}>
                        Register
                    </button>
                    <p style={{ marginTop: 10 }}>
                        Already have an account? <Link to="/">Login</Link>
                    </p>
                </form>

                {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
            </div>
        </div>
    );
}
