import { useEffect, useState } from "react";
import { getMyApplications } from "../services/applicationService";
import StatusBadge from "../components/StatusBadge";

function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();

        setApplications(data);
      } catch (error) {
        console.error(
          "Failed to fetch applications:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load your applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* Header */}
        <div className="dashboard-header">
          <p className="dashboard-eyebrow">
            Student Portal
          </p>

          <h1>My Applications</h1>

          <p>
            Track the jobs you have applied for and
            monitor your application status.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-message">
            Loading your applications...
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          applications.length === 0 && (
            <div className="section-card">
              <div className="empty-state">
                <div className="empty-state-icon">
                  📄
                </div>

                <h3>No Applications Yet</h3>

                <p>
                  You haven't applied for any jobs yet.
                  Explore available jobs to get started.
                </p>
              </div>
            </div>
          )}

        {/* Applications */}
        {!loading &&
          !error &&
          applications.length > 0 && (
            <div className="applications-list">

              {applications.map((application) => (
                <div
                  className="application-card"
                  key={application.id}
                >

                  <div className="application-card-header">

                    <div>
                      <p className="application-label">
                        Job Application
                      </p>

                      <h2>
                        {application.jobTitle ||
                          "Job Application"}
                      </h2>

                      <p className="application-company">
                        {application.companyName ||
                          "Company not specified"}
                      </p>
                    </div>

                    <StatusBadge
                      status={application.status}
                    />

                  </div>

                  <div className="application-details">

                    <div className="application-detail">
                      <span>Applied On</span>

                      <strong>
                        {application.appliedAt
                          ? new Date(
                              application.appliedAt
                            ).toLocaleDateString()
                          : "Not available"}
                      </strong>
                    </div>

                    <div className="application-detail">
                      <span>Status</span>

                      <strong>
                        {application.status}
                      </strong>
                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

      </div>
    </main>
  );
}

export default StudentApplications;