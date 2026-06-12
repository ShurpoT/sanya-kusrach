const db = require("../config/db");

exports.createTask = async (req, res) => {
    try {
        const { project_id, title, description, priority, deadline, assignee_id } = req.body;

        console.log("TASK BODY:", req.body);

        const [result] = await db.query(
            `INSERT INTO tasks 
      (project_id, title, description, priority, deadline, assignee_id)
      VALUES (?, ?, ?, ?, ?, ?)`,
            [project_id, title, description || "", priority || "medium", deadline || null, assignee_id || null],
        );

        res.json({
            message: "Task created",
            taskId: result.insertId,
        });
    } catch (err) {
        console.log("TASK ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const [tasks] = await db.query("SELECT * FROM tasks WHERE project_id = ?", [projectId]);

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status, deadline, assignee_id } = req.body;

        await db.query(
            `UPDATE tasks 
       SET title=?, description=?, priority=?, status=?, deadline=?, assignee_id=?
       WHERE id=?`,
            [title, description, priority, status, deadline, assignee_id, id],
        );

        res.json({ message: "Task updated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query("DELETE FROM tasks WHERE id = ?", [id]);

        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
