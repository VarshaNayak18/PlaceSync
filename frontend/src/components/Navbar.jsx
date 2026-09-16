import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
          <span className="navbar-subtitle">Campus Placement Platform</span>
        </div>
      </div>

      {user && (
        <div className="navbar-content">
          <div className="navbar-links">
            {user.role === "RECRUITER" && (
              <>
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
              </>
            )}

            <button
              className="navbar-link"
              onClick={goToDashboard}
            >
              Dashboard
            </button>
          </div>

          <div className="navbar-divider" />

          <div className="navbar-user">
            <div className="navbar-avatar">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="navbar-user-info">
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
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