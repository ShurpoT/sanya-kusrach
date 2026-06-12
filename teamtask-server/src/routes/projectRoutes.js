const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");
const auth = require("../middleware/authMiddleware");

// CRUD
router.post("/", authMiddleware, projectController.createProject);
router.get("/", authMiddleware, projectController.getProjects);
router.get("/:id", authMiddleware, projectController.getProjectById);
router.put("/:id", authMiddleware, projectController.updateProject);
router.delete("/:id", authMiddleware, projectController.deleteProject);
router.post("/:id/members", auth, checkRole(["admin", "manager"]), projectController.addMember);
router.get("/:id/members", auth, projectController.getMembers);

module.exports = router;
