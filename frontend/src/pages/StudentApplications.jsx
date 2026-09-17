import { useEffect, useState } from "react";
import { getMyApplications } from "../services/applicationService";

function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();

        console.log("My applications:", data);

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

        <div className="dashboard-header">
          <p className="dashboard-eyebrow">
            Student Portal
          </p>

          <h1>My Applications</h1>

          <p>
            Track the jobs you have applied for.
          </p>
        </div>

        {loading && (
          <div className="loading-message">
            Loading your applications...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          applications.length === 0 && (
            <div className="section-card">
              <h2>No Applications Yet</h2>

              <p>
                You haven't applied for any jobs yet.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          applications.length > 0 && (
            <div className="section-card">

              <h2>Your Applications</h2>

              <div className="applications-list">

                {applications.map((application) => (
                  <div
                    className="application-card"
                    key={application.id}
                  >
                    <h3>
                      {application.jobTitle ||
                        "Job Application"}
                    </h3>

                    <p>
                      <strong>Company:</strong>{" "}
                      {application.companyName ||
                        "Not specified"}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {application.status}
                    </p>
                  </div>
                ))}

              </div>

            </div>
          )}

      </div>
    </main>
  );
}

export default StudentApplications;