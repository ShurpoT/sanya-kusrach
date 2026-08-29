import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import ProjectBoard from "../pages/ProjectBoard";
import NotFoundPage from "../pages/NotFoundPage.jsx";

import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
    return (
        <Routes>
            {/* redirect */}
            <Route path="/" element={<Navigate to="/dashboard" />} />

            {/* public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* protected */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/projects"
                element={
                    <ProtectedRoute>
                        <Projects />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/projects/:id"
                element={
                    <ProtectedRoute>
                        <ProjectBoard />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
