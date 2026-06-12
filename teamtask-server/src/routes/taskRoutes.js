const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");
const auth = require("../middleware/authMiddleware");
// CRUD
// router.post("/", authMiddleware, taskController.createTask);
router.post("/", auth, checkRole(["admin", "manager"]), taskController.createTask);

// router.get("/project/:projectId", authMiddleware, taskController.getTasksByProject);
router.get("/project/:projectId", auth, checkRole(["admin", "manager", "member"]), taskController.getTasksByProject);

// router.put("/:id", authMiddleware, taskController.updateTask);
router.put("/:id", auth, checkRole(["admin", "manager", "member"]), taskController.updateTask);

// router.delete("/:id", authMiddleware, taskController.deleteTask);
router.delete("/:id", auth, checkRole(["admin"]), taskController.deleteTask);

module.exports = router;
