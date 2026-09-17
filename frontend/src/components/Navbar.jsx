import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [studentMenuOpen, setStudentMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToDashboard = () => {
    setStudentMenuOpen(false);

    if (user?.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (user?.role === "RECRUITER") {
      navigate("/recruiter/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  const navigateStudent = (path) => {
    setStudentMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="navbar">

      {/* Brand */}
      <div
        className="navbar-brand"
        onClick={goToDashboard}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            goToDashboard();
          }
        }}
      >
        <div className="navbar-logo">P</div>

        <div className="navbar-brand-text">
          <span className="navbar-title">PlaceSync</span>
          <span className="navbar-subtitle">
            Campus Placement Platform
          </span>
        </div>
      </div>

      {user && (
        <div className="navbar-content">

          {/* Recruiter Navigation */}
          {user.role === "RECRUITER" && (
            <div className="navbar-links">

              <button
                className="navbar-link"
                onClick={() => navigate("/recruiter/jobs")}
              >
                Jobs
              </button>

              <button
                className="navbar-link"
                onClick={() =>
                  navigate("/recruiter/applications")
                }
              >
                Applications
              </button>

              <button
                className="navbar-link"
                onClick={() =>
                  navigate("/recruiter/interviews")
                }
              >
                Interviews
              </button>

              <button
                className="navbar-link"
                onClick={goToDashboard}
              >
                Dashboard
              </button>

            </div>
          )}

          {/* Admin Navigation */}
          {user.role === "ADMIN" && (
            <div className="navbar-links">

              <button
                className="navbar-link"
                onClick={goToDashboard}
              >
                Dashboard
              </button>

            </div>
          )}

          {/* Student Navigation */}
          {user.role === "STUDENT" && (
            <div className="navbar-links">

              <button
                className="navbar-link"
                onClick={goToDashboard}
              >
                Dashboard
              </button>

            </div>
          )}

          <div className="navbar-divider" />

          {/* User Menu */}
          <div className="navbar-user-menu">

            <button
              type="button"
              className="navbar-user"
              onClick={() => {
                if (user.role === "STUDENT") {
                  setStudentMenuOpen(
                    (previous) => !previous
                  );
                }
              }}
            >
              <div className="navbar-avatar">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              {user.role === "STUDENT" && (
                <span className="student-dropdown-arrow">
                  ▼
                </span>
              )}

              {user.role !== "STUDENT" && (
                <div className="navbar-user-info">
                  <strong>{user.name}</strong>
                  <span>{user.role}</span>
                </div>
              )}
            </button>

            {/* Student Dropdown */}
            {user.role === "STUDENT" &&
              studentMenuOpen && (
                <div className="student-nav-menu">

                  <button
                    type="button"
                    className="student-nav-item"
                    onClick={() =>
                      navigateStudent("/student/profile")
                    }
                  >
                    <span className="student-nav-icon">
                      👤
                    </span>

                    <span>Profile</span>
                  </button>

                  <button
                    type="button"
                    className="student-nav-item"
                    onClick={() =>
                      navigateStudent("/student/jobs")
                    }
                  >
                    <span className="student-nav-icon">
                      💼
                    </span>

                    <span>Available Jobs</span>
                  </button>

                  <button
                    type="button"
                    className="student-nav-item"
                    onClick={() =>
                      navigateStudent(
                        "/student/applications"
                      )
                    }
                  >
                    <span className="student-nav-icon">
                      📄
                    </span>

                    <span>Applications</span>
                  </button>

                </div>
              )}

          </div>

          {/* Logout */}
          <button
            className="navbar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      )}
    </nav>
  );
}

export default Navbar;