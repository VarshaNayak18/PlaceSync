import { useEffect, useState } from "react";
import { getStudentJobs } from "../services/jobService";
import { checkJobEligibility } from "../services/eligibilityService";
import {
  applyForJob,
  getMyApplications,
} from "../services/applicationService";
import StatusBadge from "../components/StatusBadge";

function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [eligibility, setEligibility] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [checkingEligibility, setCheckingEligibility] =
    useState({});
  const [applying, setApplying] = useState({});

  // Load jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getStudentJobs();

        console.log("Student jobs:", data);

        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load available jobs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Load student's applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();

        const applicationMap = {};

        data.forEach((application) => {
          applicationMap[application.jobId] = application;
        });

        setApplications(applicationMap);
      } catch (error) {
        console.error(
          "Failed to fetch applications:",
          error
        );
      }
    };

    fetchApplications();
  }, []);

  // Check eligibility
  const handleCheckEligibility = async (jobId) => {
    setError("");
    setSuccess("");

    setCheckingEligibility((previous) => ({
      ...previous,
      [jobId]: true,
    }));

    try {
      const result = await checkJobEligibility(jobId);

      console.log("Eligibility result:", result);

      setEligibility((previous) => ({
        ...previous,
        [jobId]: result,
      }));
    } catch (error) {
      console.error(
        "Failed to check eligibility:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to check eligibility."
      );
    } finally {
      setCheckingEligibility((previous) => ({
        ...previous,
        [jobId]: false,
      }));
    }
  };

  // Apply for job
  const handleApply = async (jobId) => {
    setError("");
    setSuccess("");

    setApplying((previous) => ({
      ...previous,
      [jobId]: true,
    }));

    try {
      const application = await applyForJob(jobId);

      setApplications((previous) => ({
        ...previous,
        [jobId]: application,
      }));

      setSuccess(
        "Application submitted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to apply for job:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to submit application."
      );
    } finally {
      setApplying((previous) => ({
        ...previous,
        [jobId]: false,
      }));
    }
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* Header */}
        <div className="dashboard-header">
          <p className="dashboard-eyebrow">
            Student Portal
          </p>

          <h1>Available Jobs</h1>

          <p>
            Explore placement opportunities and check
            your eligibility.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-message">
            Loading available jobs...
          </div>
        )}

        {/* Empty */}
        {!loading && jobs.length === 0 && !error && (
          <div className="section-card">
            <div className="empty-state">
              <h3>No Jobs Available</h3>

              <p>
                There are currently no placement
                opportunities available.
              </p>
            </div>
          </div>
        )}

        {/* Jobs */}
        {!loading && jobs.length > 0 && (
          <div className="jobs-list">

            {jobs.map((job) => {
              const application =
                applications[job.id];

              const eligibilityResult =
                eligibility[job.id];

              return (
                <div
                  className="job-card"
                  key={job.id}
                >

                  {/* Job Header */}
                  <div className="job-card-header">
                    <div>
                      <h2>{job.title}</h2>

                      <p className="job-company">
                        Company:{" "}
                        {job.companyName ||
                          job.company?.name ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="job-details">

                    <div className="job-detail">
                      <span>Location</span>
                      <strong>
                        {job.location ||
                          "Not specified"}
                      </strong>
                    </div>

                    <div className="job-detail">
                      <span>Salary</span>
                      <strong>
                        {job.salary
                          ? `₹${job.salary}`
                          : "Not specified"}
                      </strong>
                    </div>

                    <div className="job-detail">
                      <span>Minimum CGPA</span>
                      <strong>
                        {job.minimumCgpa ??
                          "Not specified"}
                      </strong>
                    </div>

                    <div className="job-detail">
                      <span>Department</span>
                      <strong>
                        {job.department ||
                          "All Departments"}
                      </strong>
                    </div>

                    <div className="job-detail">
                      <span>Deadline</span>
                      <strong>
                        {job.deadline ||
                          "Not specified"}
                      </strong>
                    </div>

                  </div>

                  {/* Eligibility */}
                  {eligibilityResult && (
                    <div
                      className={
                        eligibilityResult.eligible
                          ? "eligibility-success"
                          : "eligibility-error"
                      }
                    >
                      <strong>
                        {eligibilityResult.eligible
                          ? "✓ You are eligible"
                          : "✕ You are not eligible"}
                      </strong>

                      {eligibilityResult.message && (
                        <p>
                          {eligibilityResult.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="job-card-actions">

  {!application && (
    <>
      <button
        className="secondary-button"
        onClick={() =>
          handleCheckEligibility(job.id)
        }
        disabled={
          checkingEligibility[job.id]
        }
      >
        {checkingEligibility[job.id]
          ? "Checking..."
          : "Check Eligibility"}
      </button>

      <button
        className="primary-button"
        onClick={() =>
          handleApply(job.id)
        }
        disabled={
          applying[job.id] ||
          (eligibilityResult &&
            !eligibilityResult.eligible)
        }
      >
        {applying[job.id]
          ? "Applying..."
          : "Apply Now"}
      </button>
    </>
  )}

  {application && (
    <div className="job-application-status">
      <span>
        Application Status
      </span>

      <StatusBadge
        status={application.status}
      />
    </div>
  )}

</div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}

export default StudentJobs;