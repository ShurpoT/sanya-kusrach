import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import styles from "./ProjectBoard.module.css";

export default function ProjectBoard() {
    const { id } = useParams();
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { user } = useContext(AuthContext);

    const [members, setMembers] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

    const fetchTasks = async () => {
        const res = await api.get(`/tasks/project/${id}`);
        setTasks(res.data);
    };

    const updateStatus = async (task, status) => {
        await api.put(`/tasks/${task.id}`, {
            ...task,
            status,
        });

        fetchTasks();
    };

    const createTask = async () => {
        console.log("project id:", id);

        await api.post("/tasks", {
            project_id: Number(id),
            title,
            description,
            priority: "medium",
            status: "todo",
        });

        setTitle("");
        setDescription("");
        fetchTasks();
    };

    const loadMembers = async () => {
        const res = await api.get(`/projects/${id}/members`);
        setMembers(res.data);
    };

    const loadUsers = async () => {
        const res = await api.get("/users");
        console.log("USERS:", res.data);
        setUsers(res.data);
    };

    const addMember = async () => {
        await api.post(`/projects/${id}/members`, {
            userId: selectedUser,
        });

        loadMembers();
    };

    useEffect(() => {
        const loadTasks = async () => {
            const res = await api.get(`/tasks/project/${id}`);
            setTasks(res.data);
        };

        loadTasks();
        loadMembers();
        loadUsers();
    }, [id]);

    const todo = tasks.filter((t) => t.status === "todo");
    const inProgress = tasks.filter((t) => t.status === "in_progress");
    const done = tasks.filter((t) => t.status === "done");

    return (
        <>
            {(user.role === "admin" || user.role === "manager") && (
                <div className="form-container">
                    <div className="form">
                        <h2>Project Board</h2>
                        <h3>Create Task</h3>

                        <input
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ marginRight: 10 }}
                        />

                        <input
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ marginRight: 10 }}
                        />

                        <button onClick={title && description ? createTask : null}>Add Task</button>
                    </div>
                </div>
            )}
            <div className={styles.board}>
                <Column title="Todo" tasks={todo} updateStatus={updateStatus} fetchTasks={fetchTasks} user={user} />
                <Column title="In Progress" tasks={inProgress} updateStatus={updateStatus} fetchTasks={fetchTasks} user={user} />
                <Column title="Done" tasks={done} updateStatus={updateStatus} fetchTasks={fetchTasks} user={user} />
            </div>

            <div className={styles.membersSection}>
                <h3>Project Members</h3>

                <ul>
                    {members.map((m) => (
                        <li key={m.id}>
                            {m.name} ({m.email})
                        </li>
                    ))}
                </ul>

                {(user.role === "admin" || user.role === "manager") && (
                    <div>
                        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                            <option value="">Select user</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>

                        <button onClick={addMember}>Add to project</button>
                    </div>
                )}
            </div>
        </>
    );
}

function Column({ title, tasks, updateStatus, fetchTasks, user }) {
    const deleteTask = async (id) => {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
    };

    return (
        <div className={styles.column}>
            <h3>{title}</h3>

            {tasks.map((t) => (
                <div key={t.id} className={styles.taskCard}>
                    <h4>{t.title}</h4>
                    <p>{t.description}</p>

                    <div className={styles.buttonGroup}>
                        <button onClick={() => updateStatus(t, "todo")}>Todo</button>
                        <button onClick={() => updateStatus(t, "in_progress")}>Doing</button>
                        <button onClick={() => updateStatus(t, "done")}>Done</button>
                    </div>

                    {user.role === "admin" && <button onClick={() => deleteTask(t.id)}>Delete</button>}
                </div>
            ))}
        </div>
    );
}
