import { useAuth } from "../context/AuthContext";

function StudentDashboard() {
  const { user } = useAuth();

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* Welcome */}
        <div className="student-dashboard-welcome">
          <div>
            <p className="dashboard-eyebrow">
              Student Portal
            </p>

            <h1>
              Welcome back, {user?.name || "Student"} 👋
            </h1>

            <p>
              Manage your placement journey from one place.
            </p>
          </div>

          <div className="student-dashboard-avatar">
            {(user?.name || "S").charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-card">

          <div className="section-card-header">
            <div>
              <h2>Placement Portal</h2>
              <p>
                Choose an option to continue.
              </p>
            </div>
          </div>

          <div className="student-quick-actions">

            <a
              href="/student/profile"
              className="student-action-card"
            >
              <div className="student-action-icon">
                👤
              </div>

              <div>
                <h3>My Profile</h3>
                <p>
                  View and update your student profile.
                </p>
              </div>

              <span>→</span>
            </a>

            <a
              href="/student/jobs"
              className="student-action-card"
            >
              <div className="student-action-icon">
                💼
              </div>

              <div>
                <h3>Available Jobs</h3>
                <p>
                  Explore placement opportunities.
                </p>
              </div>

              <span>→</span>
            </a>

            <a
              href="/student/applications"
              className="student-action-card"
            >
              <div className="student-action-icon">
                📄
              </div>

              <div>
                <h3>My Applications</h3>
                <p>
                  Track your submitted applications.
                </p>
              </div>

              <span>→</span>
            </a>

          </div>
        </div>

      </div>
    </main>
  );
}

export default StudentDashboard;