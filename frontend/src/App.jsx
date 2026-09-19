import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/StudentDashboard";
import StudentProfilePage from "./pages/StudentProfilePage";
import StudentJobs from "./pages/StudentJobs";
import StudentApplications from "./pages/StudentApplications";

import AdminDashboard from "./pages/AdminDashboard";

import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterJobs from "./pages/RecruiterJobs";
import RecruiterApplications from "./pages/RecruiterApplications";
import RecruiterInterviews from "./pages/RecruiterInterviews";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* Public Routes */}
        <Route
          path="/"
          element={<h1>PlaceSync</h1>}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            STUDENT ROUTES
        ========================= */}

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/jobs"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentApplications />
            </ProtectedRoute>
          }
        />


        {/* =========================
            ADMIN ROUTES
        ========================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* =========================
            RECRUITER ROUTES
        ========================= */}

        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <RecruiterJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/applications"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <RecruiterApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/interviews"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <RecruiterInterviews />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;