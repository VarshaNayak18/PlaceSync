import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getStudentProfile,
  updateStudentProfile,
} from "../services/studentService";
import { getStudentJobs } from "../services/jobService";
import { checkJobEligibility } from "../services/eligibilityService";
import {
  applyForJob,
  getMyApplications,
} from "../services/applicationService";
import StatusBadge from "../components/StatusBadge";
import SectionCard from "../components/SectionCard";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    usn: "",
    department: "",
    cgpa: "",
    phoneNumber: "",
  });

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");

  const [eligibility, setEligibility] = useState({});
  const [eligibilityLoading, setEligibilityLoading] = useState({});
  const [eligibilityError, setEligibilityError] = useState({});

  const [applications, setApplications] = useState({});
  const [applicationLoading, setApplicationLoading] = useState({});
  const [applicationError, setApplicationError] = useState({});
  const [applicationSuccess, setApplicationSuccess] = useState({});

  const [myApplications, setMyApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState("");

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const data = await getStudentProfile();

        setStudent(data);

        setFormData({
          name: data.name,
          email: data.email,
          usn: data.usn,
          department: data.department,
          cgpa: data.cgpa,
          phoneNumber: data.phoneNumber,
        });
      } catch (error) {
        console.error(
          "Failed to fetch student profile:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load student profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  useEffect(() => {
  const fetchJobs = async () => {
    try {
      const data = await getStudentJobs();

      setJobs(data);
    } catch (error) {
      console.error(
        "Failed to fetch jobs:",
        error
      );

      setJobsError(
        error.response?.data?.message ||
        "Failed to load available jobs."
      );
    } finally {
      setJobsLoading(false);
    }
  };

  fetchJobs();
}, []);

useEffect(() => {
  const fetchMyApplications = async () => {
    try {
      const data = await getMyApplications();

      setMyApplications(data);
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

      setApplicationsError(
        error.response?.data?.message ||
        "Failed to load your applications."
      );
    } finally {
      setApplicationsLoading(false);
    }
  };

  fetchMyApplications();
}, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = () => {
    setError("");
    setSuccess("");
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: student.name,
      email: student.email,
      usn: student.usn,
      department: student.department,
      cgpa: student.cgpa,
      phoneNumber: student.phoneNumber,
    });

    setError("");
    setSuccess("");
    setEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const updatedStudent =
        await updateStudentProfile({
          ...formData,
          cgpa: Number(formData.cgpa),
        });

      setStudent(updatedStudent);

      setFormData({
        name: updatedStudent.name,
        email: updatedStudent.email,
        usn: updatedStudent.usn,
        department: updatedStudent.department,
        cgpa: updatedStudent.cgpa,
        phoneNumber: updatedStudent.phoneNumber,
      });

      setEditing(false);

      setSuccess(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update student profile:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCheckEligibility = async (jobId) => {
  setEligibilityLoading((previous) => ({
    ...previous,
    [jobId]: true,
  }));

  setEligibilityError((previous) => ({
    ...previous,
    [jobId]: "",
  }));

  try {
    const result = await checkJobEligibility(jobId);

    setEligibility((previous) => ({
      ...previous,
      [jobId]: result,
    }));
  } catch (error) {
    console.error(
      "Failed to check eligibility:",
      error
    );

    setEligibilityError((previous) => ({
      ...previous,
      [jobId]:
        error.response?.data?.message ||
        "Failed to check eligibility.",
    }));
  } finally {
    setEligibilityLoading((previous) => ({
      ...previous,
      [jobId]: false,
    }));
  }
};

const handleApply = async (jobId) => {
  setApplicationLoading((previous) => ({
    ...previous,
    [jobId]: true,
  }));

  setApplicationError((previous) => ({
    ...previous,
    [jobId]: "",
  }));

  setApplicationSuccess((previous) => ({
    ...previous,
    [jobId]: "",
  }));

  try {
    const result = await applyForJob(jobId);

    setApplications((previous) => ({
      ...previous,
      [jobId]: result,
    }));

    setApplicationSuccess((previous) => ({
      ...previous,
      [jobId]: "Application submitted successfully.",
    }));
  } catch (error) {
    console.error(
      "Failed to apply for job:",
      error
    );

    setApplicationError((previous) => ({
      ...previous,
      [jobId]:
        error.response?.data?.message ||
        "Failed to submit application.",
    }));
  } finally {
    setApplicationLoading((previous) => ({
      ...previous,
      [jobId]: false,
    }));
  }
};

  return (
    <>
      <Navbar />

      <main
  style={{
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 24px 40px",
  }}
>
        <h1
  style={{
    marginBottom: "24px",
  }}
>
  Student Dashboard
</h1>

        {loading && (
          <p>Loading your profile...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {success && (
          <p>{success}</p>
        )}

        {!loading && !error && student && (
          <SectionCard title="Your Profile">

            {!editing ? (
              <>
                <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  }}
>
  <div>
    <strong>Name</strong>
    <p>{student.name}</p>
  </div>

  <div>
    <strong>Email</strong>
    <p>{student.email}</p>
  </div>

  <div>
    <strong>USN</strong>
    <p>{student.usn}</p>
  </div>

  <div>
    <strong>Department</strong>
    <p>{student.department}</p>
  </div>

  <div>
    <strong>CGPA</strong>
    <p>{student.cgpa}</p>
  </div>

  <div>
    <strong>Phone</strong>
    <p>{student.phoneNumber}</p>
  </div>
</div>

                <button onClick={handleEdit}>
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Name</label>
                  <br />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <br />

                <div>
                  <label>Email</label>
                  <br />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <br />

                <div>
                  <label>USN</label>
                  <br />

                  <input
                    type="text"
                    name="usn"
                    value={formData.usn}
                    onChange={handleChange}
                    required
                  />
                </div>

                <br />

                <div>
                  <label>Department</label>
                  <br />

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>

                <br />

                <div>
                  <label>CGPA</label>
                  <br />

                  <input
                    type="number"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    step="0.01"
                    required
                  />
                </div>

                <br />

                <div>
                  <label>Phone Number</label>
                  <br />

                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <br />

                <button
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                {" "}

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              </form>
            )}
          </SectionCard>
        )}
<SectionCard title="Available Jobs">

  {jobsLoading && (
    <p>Loading available jobs...</p>
  )}

  {jobsError && (
    <p>{jobsError}</p>
  )}

  {!jobsLoading &&
    !jobsError &&
    jobs.length === 0 && (
      <p>No jobs are currently available.</p>
    )}

  {!jobsLoading &&
    !jobsError &&
    jobs.length > 0 && (
      <div>

        {jobs.map((job) => (
          <article
            key={job.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "18px",
              marginBottom: "16px",
              backgroundColor: "#f9fafb",
            }}
          >

            <h3>{job.title}</h3>

            <p>
              <strong>Company:</strong>{" "}
              {job.companyName}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {job.location}
            </p>

            <p>
              <strong>Salary:</strong>{" "}
              {job.salary}
            </p>

            <p>
              <strong>Minimum CGPA:</strong>{" "}
              {job.minimumCgpa}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {job.eligibleDepartment}
            </p>

            <p>
              <strong>Deadline:</strong>{" "}
              {job.applicationDeadline}
            </p>

            <button
              onClick={() =>
                handleCheckEligibility(job.id)
              }
              disabled={eligibilityLoading[job.id]}
            >
              {eligibilityLoading[job.id]
                ? "Checking..."
                : "Check Eligibility"}
            </button>

            {eligibilityError[job.id] && (
              <p>
                {eligibilityError[job.id]}
              </p>
            )}

            {eligibility[job.id] && (
              <div>
                {eligibility[job.id].eligible ? (
                  <p>
                    <strong>
                      You are eligible for this job.
                    </strong>
                  </p>
                ) : (
                  <div>
                    <p>
                      <strong>
                        You are not eligible for this job.
                      </strong>
                    </p>

                    <ul>
                      {eligibility[job.id].reasons.map(
                        (reason, index) => (
                          <li key={index}>
                            {reason}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!applications[job.id] && (
              <button
                onClick={() =>
                  handleApply(job.id)
                }
                disabled={
                  applicationLoading[job.id]
                }
              >
                {applicationLoading[job.id]
                  ? "Applying..."
                  : "Apply"}
              </button>
            )}

            {applicationSuccess[job.id] && (
              <p>
                {applicationSuccess[job.id]}
              </p>
            )}

            {applicationError[job.id] && (
              <p>
                {applicationError[job.id]}
              </p>
            )}

            {applications[job.id] && (
              <p>
                Application Status:{" "}
                <StatusBadge
                  status={
                    applications[job.id].status
                  }
                />
              </p>
            )}

          </article>
        ))}

      </div>
    )}

</SectionCard>


<SectionCard title="My Applications">

  {applicationsLoading && (
    <p>Loading your applications...</p>
  )}

  {applicationsError && (
    <p>{applicationsError}</p>
  )}

  {!applicationsLoading &&
    !applicationsError &&
    myApplications.length === 0 && (
      <p>
        You have not applied for any jobs yet.
      </p>
    )}

  {!applicationsLoading &&
    !applicationsError &&
    myApplications.length > 0 && (
      <div>

        {myApplications.map((application) => (
          <article
  key={application.id}
  style={{
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "18px",
    marginBottom: "16px",
    backgroundColor: "#f9fafb",
  }}
>

            <h3>
              {application.jobTitle}
            </h3>

            <p>
              <strong>Company:</strong>{" "}
              {application.companyName}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <StatusBadge
                status={application.status}
              />
            </p>

            <p>
              <strong>Applied At:</strong>{" "}
              {new Date(
                application.appliedAt
              ).toLocaleString()}
            </p>

            <hr />

          </article>
        ))}

      </div>
    )}

</SectionCard>
      </main>
    </>
  );
}

export default StudentDashboard;