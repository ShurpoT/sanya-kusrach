import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

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
        <div className={styles.container}>
            <h2>Dashboard</h2>

            {/* STATS */}
            <div className={styles.statsGrid}>
                <Card title="Projects" value={projects.length} />
                <Card title="Todo" value={todo.length} />
                <Card title="In Progress" value={inProgress.length} />
                <Card title="Done" value={done.length} />
            </div>

            {/* PROJECTS */}
            <h3>Projects</h3>

            {projects.length === 0 && <p>No projects yet</p>}

            {projects.length === 0 ? (
                <p>No projects yet</p>
            ) : (
                <div className={styles.projectList}>
                    {projects.map((p) => (
                        <div key={p.id} onClick={() => navigate(`/projects/${p.id}`)} className={styles.projectCard}>
                            <h4>{p.name}</h4>
                            <p>{p.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
// карточка
function Card({ title, value }) {
    return (
        <div className={styles.card}>
            <h4>{title}</h4>
            <h2>{value}</h2>
        </div>
    );
}
