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
    if (user?.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (user?.role === "RECRUITER") {
      navigate("/recruiter/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  const scrollToStudentSection = (sectionId) => {
    setStudentMenuOpen(false);

    if (window.location.pathname !== "/student/dashboard") {
      navigate("/student/dashboard");

      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav className="navbar">
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
                onClick={() => navigate("/recruiter/applications")}
              >
                Applications
              </button>

              <button
                className="navbar-link"
                onClick={() => navigate("/recruiter/interviews")}
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
              className="navbar-user"
              onClick={() => {
                if (user.role === "STUDENT") {
                  setStudentMenuOpen((previous) => !previous);
                }
              }}
            >
              <div className="navbar-avatar">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="navbar-user-info">
                <strong>{user.name}</strong>
                <span>{user.role}</span>
              </div>

              {user.role === "STUDENT" && (
                <span className="navbar-dropdown-arrow">
                  {studentMenuOpen ? "▲" : "▼"}
                </span>
              )}
            </button>

            <button
  onClick={() => {
    setStudentMenuOpen(false);
    navigate("/student/profile");
  }}
>
  <span>👤</span>
  Profile
</button>

<button
  onClick={() => {
    setStudentMenuOpen(false);
    navigate("/student/jobs");
  }}
>
  <span>💼</span>
  Available Jobs
</button>

<button
  onClick={() => {
    setStudentMenuOpen(false);
    navigate("/student/applications");
  }}
>
  <span>📄</span>
  Applications
</button>
          </div>

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