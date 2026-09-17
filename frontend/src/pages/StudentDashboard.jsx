import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentProfile } from "../services/studentService";
import { getStudentJobs } from "../services/jobService";
import { getMyApplications } from "../services/applicationService";
import { useAuth } from "../context/AuthContext";

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profileData, jobsData, applicationsData] =
          await Promise.all([
            getStudentProfile(),
            getStudentJobs(),
            getMyApplications(),
          ]);

        setProfile(profileData);
        setJobs(jobsData);
        setApplications(applicationsData);
      } catch (error) {
        console.error(
          "Failed to load student dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const selectedCount = applications.filter(
    (application) =>
      application.status === "SELECTED"
  ).length;

  const shortlistedCount = applications.filter(
    (application) =>
      application.status === "SHORTLISTED"
  ).length;

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading-message">
            Loading your dashboard...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* Welcome Header */}
        <div className="student-dashboard-hero">

          <div>
            <p className="dashboard-eyebrow">
              Student Portal
            </p>

            <h1>
              Welcome back,{" "}
              {user?.name || "Student"} 👋
            </h1>

            <p>
              Manage your placement journey from one
              place.
            </p>
          </div>

          <div className="student-dashboard-avatar">
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "S"}
          </div>

        </div>

        {/* Statistics */}
        <div className="student-stats-grid">

          <div className="student-stat-card">
            <span>Profile</span>

            <strong>
              {profile ? "Complete" : "Incomplete"}
            </strong>

            <button
              onClick={() =>
                navigate("/student/profile")
              }
            >
              View Profile →
            </button>
          </div>

          <div className="student-stat-card">
            <span>Available Jobs</span>

            <strong>{jobs.length}</strong>

            <button
              onClick={() =>
                navigate("/student/jobs")
              }
            >
              Explore Jobs →
            </button>
          </div>

          <div className="student-stat-card">
            <span>Applications</span>

            <strong>{applications.length}</strong>

            <button
              onClick={() =>
                navigate("/student/applications")
              }
            >
              View Applications →
            </button>
          </div>

          <div className="student-stat-card">
            <span>Selected</span>

            <strong>{selectedCount}</strong>

            <button
              onClick={() =>
                navigate("/student/applications")
              }
            >
              Track Status →
            </button>
          </div>

        </div>

        {/* Placement Overview */}
        <div className="section-card student-overview-card">

          <div className="student-overview-header">
            <div>
              <h2>Placement Overview</h2>

              <p>
                A quick look at your current placement
                activity.
              </p>
            </div>
          </div>

          <div className="student-overview-grid">

            <div>
              <span>Total Applications</span>
              <strong>{applications.length}</strong>
            </div>

            <div>
              <span>Shortlisted</span>
              <strong>{shortlistedCount}</strong>
            </div>

            <div>
              <span>Selected</span>
              <strong>{selectedCount}</strong>
            </div>

            <div>
              <span>Jobs Available</span>
              <strong>{jobs.length}</strong>
            </div>

          </div>

        </div>

        {/* Quick Actions */}
        <div className="section-card">

          <h2>Quick Actions</h2>

          <div className="student-quick-actions">

            <button
              onClick={() =>
                navigate("/student/profile")
              }
            >
              <span>👤</span>
              <div>
                <strong>My Profile</strong>
                <small>
                  View and update your student profile.
                </small>
              </div>
              <b>→</b>
            </button>

            <button
              onClick={() =>
                navigate("/student/jobs")
              }
            >
              <span>💼</span>
              <div>
                <strong>Available Jobs</strong>
                <small>
                  Explore placement opportunities.
                </small>
              </div>
              <b>→</b>
            </button>

            <button
              onClick={() =>
                navigate("/student/applications")
              }
            >
              <span>📄</span>
              <div>
                <strong>My Applications</strong>
                <small>
                  Track your submitted applications.
                </small>
              </div>
              <b>→</b>
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}

export default StudentDashboard;