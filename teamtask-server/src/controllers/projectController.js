const db = require("../config/db");

// CREATE PROJECT
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        const [result] = await db.query("INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)", [
            name,
            description,
            userId,
        ]);

        await db.query("INSERT INTO project_members (project_id, user_id, project_role) VALUES (?, ?, 'owner')", [
            result.insertId,
            userId,
        ]);

        res.json({
            message: "Project created",
            projectId: result.insertId,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET ALL PROJECTS (для текущего пользователя)
exports.getProjects = async (req, res) => {
    try {
        const userId = req.user.id;

        const [projects] = await db.query(
            `
      SELECT p.*
      FROM projects p
      JOIN project_members pm ON pm.project_id = p.id
      WHERE pm.user_id = ?
    `,
            [userId],
        );

        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET ONE PROJECT
exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const [project] = await db.query("SELECT * FROM projects WHERE id = ?", [id]);

        if (project.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE PROJECT
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;

        await db.query("UPDATE projects SET name = ?, description = ?, status = ? WHERE id = ?", [name, description, status, id]);

        res.json({ message: "Project updated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE PROJECT
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query("DELETE FROM projects WHERE id = ?", [id]);

        res.json({ message: "Project deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addMember = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { userId } = req.body;

        await db.query("INSERT INTO project_members (project_id, user_id) VALUES (?, ?)", [projectId, userId]);

        res.json({ message: "User added to project" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMembers = async (req, res) => {
    try {
        const projectId = req.params.id;

        const [rows] = await db.query(
            `
            SELECT u.id, u.name, u.email, u.role
            FROM users u
            JOIN project_members pm ON pm.user_id = u.id
            WHERE pm.project_id = ?
        `,
            [projectId],
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
