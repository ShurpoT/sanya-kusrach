import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);

    const fetchProjects = async () => {
        const res = await api.get("/projects");
        setProjects(res.data);
    };

    useEffect(() => {
        const load = async () => {
            const res = await api.get("/projects");
            setProjects(res.data);
        };

        load();
    }, []);

    const createProject = async () => {
        if (!name || !description) return;

        await api.post("/projects", { name, description });

        setName("");
        setDescription("");

        fetchProjects();
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Projects</h2>

            {/* CREATE PROJECT */}
            {(user.role === "admin" || user.role === "manager") && (
                <div className="form-container">
                    <div className="form">
                        <input
                            placeholder="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ marginRight: 10 }}
                        />

                        <input
                            placeholder="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ marginRight: 10 }}
                        />

                        <button onClick={createProject}>Create</button>
                    </div>
                </div>
            )}

            {/* PROJECT LIST */}
            {projects
                .sort((a, b) => b.id - a.id)
                .map((p) => (
                    <div
                        key={p.id}
                        onClick={() => navigate(`/projects/${p.id}`)}
                        style={{
                            border: "1px solid #ccc",
                            margin: 10,
                            padding: 15,
                            cursor: "pointer",
                            borderRadius: 6,
                            transition: "0.2s",
                        }}>
                        <h3 style={{ margin: 0 }}>{p.name}</h3>
                        <p style={{ marginTop: 5 }}>{p.description}</p>
                    </div>
                ))}
        </div>
    );
}
