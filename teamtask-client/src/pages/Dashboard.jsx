import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    const loadData = async () => {
        try {
            const projectsRes = await api.get("/projects");
            const projectsData = projectsRes.data;
            setProjects(projectsData);

            const tasksPromises = projectsData.map((p) => api.get(`/tasks/project/${p.id}`));

            const tasksResults = await Promise.all(tasksPromises);

            const allTasks = tasksResults.flatMap((r) => r.data);
            setTasks(allTasks);
        } catch (err) {
            console.log("Dashboard error:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const todo = tasks.filter((t) => t.status === "todo");
    const inProgress = tasks.filter((t) => t.status === "in_progress");
    const done = tasks.filter((t) => t.status === "done");

    return (
        <div style={{ padding: 20 }}>
            <h2>Dashboard</h2>

            {/* STATS */}
            <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
                <Card title="Projects" value={projects.length} />
                <Card title="Todo" value={todo.length} />
                <Card title="In Progress" value={inProgress.length} />
                <Card title="Done" value={done.length} />
            </div>

            {/* PROJECTS */}
            <h3>Projects</h3>

            {projects.length === 0 && <p>No projects yet</p>}

            {projects.map((p) => (
                <div
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    style={{
                        border: "1px solid #ddd",
                        padding: 10,
                        marginBottom: 10,
                        borderRadius: 6,
                        cursor: "pointer",
                        transition: "0.2s",
                    }}>
                    <h4>{p.name}</h4>
                    <p>{p.description}</p>
                </div>
            ))}
        </div>
    );
}
// карточка
function Card({ title, value }) {
    return (
        <div
            style={{
                border: "1px solid #ddd",
                padding: 15,
                minWidth: 120,
                textAlign: "center",
                borderRadius: 8,
            }}>
            <h4>{title}</h4>
            <h2>{value}</h2>
        </div>
    );
}
