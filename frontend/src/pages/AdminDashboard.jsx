import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAdminDashboard } from "../services/dashboardService";
import StatCard from "../components/StatCard";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../services/companyService";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../services/jobService";
import {
  getAllApplications,
  updateApplicationStatus,
} from "../services/applicationService";
import StatusBadge from "../components/StatusBadge";
import SectionCard from "../components/SectionCard";
import {
  getAllInterviews,
  scheduleInterview,
  updateInterviewStatus,
  cancelInterview,
} from "../services/interviewService";
import AdminSectionNav from "../components/AdminSectionNav";

function AdminDashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [companies, setCompanies] = useState([]);
const [companiesLoading, setCompaniesLoading] =
  useState(true);
const [companiesError, setCompaniesError] =
  useState("");

    const [companyForm, setCompanyForm] = useState({
  name: "",
  industry: "",
  location: "",
  website: "",
  contactEmail: "",
});

const [companySaving, setCompanySaving] =
  useState(false);

const [companySuccess, setCompanySuccess] =
  useState("");

const [companyFormError, setCompanyFormError] =
  useState("");

  const [editingCompanyId, setEditingCompanyId] =
  useState(null);

  const [jobs, setJobs] = useState([]);
const [jobsLoading, setJobsLoading] =
  useState(true);
const [jobsError, setJobsError] =
  useState("");

  const [jobForm, setJobForm] = useState({
  title: "",
  description: "",
  location: "",
  salary: "",
  minimumCgpa: "",
  eligibleDepartment: "",
  requiredSkills: "",
  applicationDeadline: "",
  companyId: "",
});

const [jobSaving, setJobSaving] =
  useState(false);

const [jobSuccess, setJobSuccess] =
  useState("");

const [jobFormError, setJobFormError] =
  useState("");

const [editingJobId, setEditingJobId] =
  useState(null);

  const [applications, setApplications] = useState([]);
const [applicationsLoading, setApplicationsLoading] = useState(true);
const [applicationsError, setApplicationsError] = useState("");

const [updatingApplicationId, setUpdatingApplicationId] = useState(null);
const [applicationStatusSuccess, setApplicationStatusSuccess] = useState("");
const [applicationStatusError, setApplicationStatusError] = useState("");

const [applicationSearch, setApplicationSearch] = useState("");
const [applicationStatusFilter, setApplicationStatusFilter] = useState("ALL");

const [interviews, setInterviews] = useState([]);
const [interviewsLoading, setInterviewsLoading] = useState(true);
const [interviewsError, setInterviewsError] = useState("");

const [interviewForm, setInterviewForm] = useState({
  applicationId: "",
  interviewDateTime: "",
  mode: "",
  meetingLink: "",
  interviewerName: "",
});

const [interviewSaving, setInterviewSaving] = useState(false);
const [interviewSuccess, setInterviewSuccess] = useState("");
const [interviewFormError, setInterviewFormError] = useState("");

const [updatingInterviewId, setUpdatingInterviewId] = useState(null);
const [cancellingInterviewId, setCancellingInterviewId] =
  useState(null);
const [interviewActionSuccess, setInterviewActionSuccess] =
  useState("");
const [interviewActionError, setInterviewActionError] =
  useState("");

  const handleCompanyChange = (event) => {
  const { name, value } = event.target;

  setCompanyForm((previous) => ({
    ...previous,
    [name]: value,
  }));
};

const handleCompanySubmit = async (event) => {
  event.preventDefault();

  setCompanySaving(true);
  setCompanySuccess("");
  setCompanyFormError("");

  try {
    if (editingCompanyId) {
      const updatedCompany =
        await updateCompany(
          editingCompanyId,
          companyForm
        );

      setCompanies((previous) =>
        previous.map((company) =>
          company.id === editingCompanyId
            ? updatedCompany
            : company
        )
      );

      setCompanySuccess(
        "Company updated successfully."
      );

      setEditingCompanyId(null);
    } else {
      const newCompany =
        await createCompany(companyForm);

      setCompanies((previous) => [
        ...previous,
        newCompany,
      ]);

      setCompanySuccess(
        "Company created successfully."
      );
    }

    setCompanyForm({
      name: "",
      industry: "",
      location: "",
      website: "",
      contactEmail: "",
    });
  } catch (error) {
    console.error(
      "Failed to save company:",
      error
    );

    setCompanyFormError(
      error.response?.data?.message ||
      "Failed to save company."
    );
  } finally {
    setCompanySaving(false);
  }
};

const handleEditCompany = (company) => {
  setEditingCompanyId(company.id);

  setCompanyForm({
    name: company.name,
    industry: company.industry || "",
    location: company.location || "",
    website: company.website || "",
    contactEmail: company.contactEmail || "",
  });

  setCompanySuccess("");
  setCompanyFormError("");
};

const handleDeleteCompany = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this company?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteCompany(id);

    setCompanies((previous) =>
      previous.filter(
        (company) => company.id !== id
      )
    );

    setCompanySuccess(
      "Company deleted successfully."
    );

    setCompanyFormError("");
  } catch (error) {
    console.error(
      "Failed to delete company:",
      error
    );

    setCompanyFormError(
      error.response?.data?.message ||
      "Failed to delete company."
    );
  }
};

    useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const data = await getAdminDashboard();

      setDashboard(data);
    } catch (error) {
      console.error(
        "Failed to load admin dashboard:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);

const handleJobChange = (event) => {
  const { name, value } = event.target;

  setJobForm((previous) => ({
    ...previous,
    [name]: value,
  }));
};

const handleJobSubmit = async (event) => {
  event.preventDefault();

  setJobSaving(true);
  setJobSuccess("");
  setJobFormError("");

  try {
    const jobData = {
      ...jobForm,
      salary: Number(jobForm.salary),
      minimumCgpa: Number(jobForm.minimumCgpa),
      companyId: Number(jobForm.companyId),
    };

    if (editingJobId) {
      const updatedJob = await updateJob(
        editingJobId,
        jobData
      );

      setJobs((previous) =>
        previous.map((job) =>
          job.id === editingJobId
            ? updatedJob
            : job
        )
      );

      setJobSuccess(
        "Job updated successfully."
      );

      setEditingJobId(null);
    } else {
      const newJob = await createJob(jobData);

      setJobs((previous) => [
        ...previous,
        newJob,
      ]);

      setJobSuccess(
        "Job created successfully."
      );
    }

    setJobForm({
      title: "",
      description: "",
      location: "",
      salary: "",
      minimumCgpa: "",
      eligibleDepartment: "",
      requiredSkills: "",
      applicationDeadline: "",
      companyId: "",
    });
  } catch (error) {
    console.error(
      "Failed to save job:",
      error
    );

    setJobFormError(
      error.response?.data?.message ||
      "Failed to save job."
    );
  } finally {
    setJobSaving(false);
  }
};

const handleEditJob = (job) => {
  setEditingJobId(job.id);

  setJobForm({
    title: job.title || "",
    description: job.description || "",
    location: job.location || "",
    salary: job.salary ?? "",
    minimumCgpa: job.minimumCgpa ?? "",
    eligibleDepartment:
      job.eligibleDepartment || "",
    requiredSkills: job.requiredSkills || "",
    applicationDeadline:
      job.applicationDeadline || "",
    companyId: job.companyId ?? "",
  });

  setJobSuccess("");
  setJobFormError("");
};

const handleDeleteJob = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this job?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteJob(id);

    setJobs((currentJobs) =>
      currentJobs.filter((job) => job.id !== id)
    );

    setJobSuccess("Job deleted successfully.");
    setJobsError("");
  } catch (error) {
    console.error("Failed to delete job:", error);

    setJobsError(
      error.response?.data?.message || "Failed to delete job."
    );
  }
};

const handleApplicationStatusUpdate = async (id, status) => {
  try {
    setUpdatingApplicationId(id);
    setApplicationStatusSuccess("");
    setApplicationStatusError("");

    const updatedApplication =
      await updateApplicationStatus(id, status);

    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === id
          ? updatedApplication
          : application
      )
    );

    setApplicationStatusSuccess(
      "Application status updated successfully."
    );
  } catch (error) {
    console.error(
      "Failed to update application status:",
      error
    );

    setApplicationStatusError(
      error.response?.data?.message ||
        "Failed to update application status."
    );
  } finally {
    setUpdatingApplicationId(null);
  }
};

const filteredApplications = applications.filter((application) => {
  const searchTerm = applicationSearch.toLowerCase().trim();

  const matchesSearch =
    application.studentName?.toLowerCase().includes(searchTerm) ||
    application.studentUsn?.toLowerCase().includes(searchTerm) ||
    application.jobTitle?.toLowerCase().includes(searchTerm) ||
    application.companyName?.toLowerCase().includes(searchTerm);

  const matchesStatus =
    applicationStatusFilter === "ALL" ||
    application.status === applicationStatusFilter;

  return matchesSearch && matchesStatus;
});

const handleInterviewChange = (event) => {
  const { name, value } = event.target;

  setInterviewForm((currentForm) => ({
    ...currentForm,
    [name]: value,
  }));
};

const handleScheduleInterview = async (event) => {
  event.preventDefault();

  try {
    setInterviewSaving(true);
    setInterviewSuccess("");
    setInterviewFormError("");

    const interviewData = {
      applicationId: Number(interviewForm.applicationId),
      interviewDateTime: interviewForm.interviewDateTime,
      mode: interviewForm.mode,
      meetingLink: interviewForm.meetingLink,
      interviewerName: interviewForm.interviewerName,
    };

    const newInterview =
      await scheduleInterview(interviewData);

    setInterviews((currentInterviews) => [
      ...currentInterviews,
      newInterview,
    ]);

    setInterviewForm({
      applicationId: "",
      interviewDateTime: "",
      mode: "",
      meetingLink: "",
      interviewerName: "",
    });

    setInterviewSuccess(
      "Interview scheduled successfully."
    );
  } catch (error) {
    console.error(
      "Failed to schedule interview:",
      error
    );

    setInterviewFormError(
      error.response?.data?.message ||
        "Failed to schedule interview."
    );
  } finally {
    setInterviewSaving(false);
  }
};

const handleInterviewStatusUpdate = async (id, status) => {
  try {
    setUpdatingInterviewId(id);
    setInterviewActionSuccess("");
    setInterviewActionError("");

    const updatedInterview =
      await updateInterviewStatus(id, status);

    setInterviews((currentInterviews) =>
      currentInterviews.map((interview) =>
        interview.id === id
          ? updatedInterview
          : interview
      )
    );

    setInterviewActionSuccess(
      "Interview status updated successfully."
    );
  } catch (error) {
    console.error(
      "Failed to update interview status:",
      error
    );

    setInterviewActionError(
      error.response?.data?.message ||
        "Failed to update interview status."
    );
  } finally {
    setUpdatingInterviewId(null);
  }
};

const handleCancelInterview = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this interview?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setCancellingInterviewId(id);
    setInterviewActionSuccess("");
    setInterviewActionError("");

    await cancelInterview(id);

    setInterviews((currentInterviews) =>
      currentInterviews.map((interview) =>
        interview.id === id
          ? {
              ...interview,
              status: "CANCELLED",
            }
          : interview
      )
    );

    setInterviewActionSuccess(
      "Interview cancelled successfully."
    );
  } catch (error) {
    console.error(
      "Failed to cancel interview:",
      error
    );

    setInterviewActionError(
      error.response?.data?.message ||
        "Failed to cancel interview."
    );
  } finally {
    setCancellingInterviewId(null);
  }
};

useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();

      setCompanies(data);
    } catch (error) {
      console.error(
        "Failed to load companies:",
        error
      );

      setCompaniesError(
        error.response?.data?.message ||
        "Failed to load companies."
      );
    } finally {
      setCompaniesLoading(false);
    }
  };

  fetchCompanies();
}, []);

useEffect(() => {
  const fetchJobs = async () => {
    try {
      const data = await getJobs();

      setJobs(data);
    } catch (error) {
      console.error(
        "Failed to load jobs:",
        error
      );

      setJobsError(
        error.response?.data?.message ||
        "Failed to load jobs."
      );
    } finally {
      setJobsLoading(false);
    }
  };

  fetchJobs();
}, []);

useEffect(() => {
  const fetchApplications = async () => {
    try {
      const data = await getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error("Failed to load applications:", error);

      setApplicationsError(
        error.response?.data?.message ||
          "Failed to load applications."
      );
    } finally {
      setApplicationsLoading(false);
    }
  };

  fetchApplications();
}, []);

useEffect(() => {
  const fetchInterviews = async () => {
    try {
      const data = await getAllInterviews();
      setInterviews(data);
    } catch (error) {
      console.error("Failed to load interviews:", error);

      setInterviewsError(
        error.response?.data?.message ||
          "Failed to load interviews."
      );
    } finally {
      setInterviewsLoading(false);
    }
  };

  fetchInterviews();
}, []);

  return (
    <>
      <Navbar />

      <main 
      className="admin-dashboard"
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
    Admin Dashboard
  </h1>

  <AdminSectionNav />

  {loading && (
    <p>Loading dashboard...</p>
  )}

  {error && (
    <p>{error}</p>
  )}

  

  {!loading && !error && dashboard && (
    <div>
      <p>
        Welcome to the PlaceSync admin dashboard.
      </p>

      <div
      className="admin-stats-grid"
  style={{
    id:"overview",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "24px",
  }}
>
  <StatCard
    title="Total Students"
    value={dashboard.totalStudents}
  />

  <StatCard
    title="Total Companies"
    value={dashboard.totalCompanies}
  />

  <StatCard
    title="Total Jobs"
    value={dashboard.totalJobs}
  />

  <StatCard
    title="Total Applications"
    value={dashboard.totalApplications}
  />

  <StatCard
    title="Total Selected"
    value={dashboard.totalSelected}
  />

  <StatCard
    title="Scheduled Interviews"
    value={dashboard.totalScheduledInterviews}
  />

  <section
  style={{
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "24px",
    border: "1px solid #e5e7eb",
  }}
>
  <h2>Add Company</h2>

  <form
    onSubmit={handleCompanySubmit}
    style={{
      display: "grid",
      gap: "12px",
      marginTop: "16px",
    }}
  >
    <input
      type="text"
      name="name"
      placeholder="Company Name"
      value={companyForm.name}
      onChange={handleCompanyChange}
      required
    />

    <input
      type="text"
      name="industry"
      placeholder="Industry"
      value={companyForm.industry}
      onChange={handleCompanyChange}
    />

    <input
      type="text"
      name="location"
      placeholder="Location"
      value={companyForm.location}
      onChange={handleCompanyChange}
    />

    <input
      type="url"
      name="website"
      placeholder="Website"
      value={companyForm.website}
      onChange={handleCompanyChange}
    />

    <input
      type="email"
      name="contactEmail"
      placeholder="Contact Email"
      value={companyForm.contactEmail}
      onChange={handleCompanyChange}
      required
    />

    <button
  type="submit"
  disabled={companySaving}
>
  {companySaving
    ? "Saving..."
    : editingCompanyId
      ? "Update Company"
      : "Add Company"}
</button>
  </form>

  {companySuccess && (
    <p>{companySuccess}</p>
  )}

  {companyFormError && (
    <p>{companyFormError}</p>
  )}
</section>

<section
  style={{
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "24px",
    border: "1px solid #e5e7eb",
  }}
>
  <h2>
    {editingJobId
      ? "Edit Job"
      : "Add Job"}
  </h2>

  <form
    onSubmit={handleJobSubmit}
    style={{
      display: "grid",
      gap: "12px",
      marginTop: "16px",
    }}
  >
    <input
      type="text"
      name="title"
      placeholder="Job Title"
      value={jobForm.title}
      onChange={handleJobChange}
      required
    />

    <textarea
      name="description"
      placeholder="Job Description"
      value={jobForm.description}
      onChange={handleJobChange}
      rows="4"
    />

    <input
      type="text"
      name="location"
      placeholder="Location"
      value={jobForm.location}
      onChange={handleJobChange}
      required
    />

    <input
      type="number"
      name="salary"
      placeholder="Salary"
      value={jobForm.salary}
      onChange={handleJobChange}
      min="1"
      required
    />

    <input
      type="number"
      name="minimumCgpa"
      placeholder="Minimum CGPA"
      value={jobForm.minimumCgpa}
      onChange={handleJobChange}
      min="0"
      max="10"
      step="0.1"
      required
    />

    <input
      type="text"
      name="eligibleDepartment"
      placeholder="Eligible Department"
      value={jobForm.eligibleDepartment}
      onChange={handleJobChange}
      required
    />

    <input
      type="text"
      name="requiredSkills"
      placeholder="Required Skills"
      value={jobForm.requiredSkills}
      onChange={handleJobChange}
    />

    <input
      type="date"
      name="applicationDeadline"
      value={jobForm.applicationDeadline}
      onChange={handleJobChange}
      required
    />

    <select
      name="companyId"
      value={jobForm.companyId}
      onChange={handleJobChange}
      required
    >
      <option value="">
        Select Company
      </option>

      {companies.map((company) => (
        <option
          key={company.id}
          value={company.id}
        >
          {company.name}
        </option>
      ))}
    </select>

    <button
      type="submit"
      disabled={jobSaving}
    >
      {jobSaving
        ? "Saving..."
        : editingJobId
          ? "Update Job"
          : "Add Job"}
    </button>

    {editingJobId && (
      <button
        type="button"
        onClick={() => {
          setEditingJobId(null);

          setJobForm({
            title: "",
            description: "",
            location: "",
            salary: "",
            minimumCgpa: "",
            eligibleDepartment: "",
            requiredSkills: "",
            applicationDeadline: "",
            companyId: "",
          });

          setJobSuccess("");
          setJobFormError("");
        }}
      >
        Cancel Edit
      </button>
    )}
  </form>

  {jobSuccess && (
    <p>{jobSuccess}</p>
  )}

  {jobFormError && (
    <p>{jobFormError}</p>
  )}
</section>



    
  <div id="companies">
    <section
  style={{
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "24px",
    border: "1px solid #e5e7eb",
  }}
></section>
  <SectionCard title="Companies">

    

  {companiesLoading && (
    <p>Loading companies...</p>
  )}

  {companiesError && (
    <p>{companiesError}</p>
  )}

  {!companiesLoading &&
    !companiesError &&
    companies.length === 0 && (
      <p>No companies found.</p>
    )}

  {!companiesLoading &&
    !companiesError &&
    companies.length > 0 && (
      <div
        style={{
          marginTop: "16px",
        }}
      >
        {companies.map((company) => (
          <article
            key={company.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "18px",
              marginBottom: "16px",
            }}
          >
            <h3>{company.name}</h3>

            <p>
              <strong>Industry:</strong>{" "}
              {company.industry}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {company.location}
            </p>

            <p>
              <strong>Website:</strong>{" "}
              {company.website}
            </p>

            <p>
              <strong>Contact Email:</strong>{" "}
              {company.contactEmail}
            </p>

            <button
  onClick={() =>
    handleEditCompany(company)
  }
>
  Edit
</button>

<button
  onClick={() =>
    handleDeleteCompany(company.id)
  }
>
  Delete
</button>
          </article>
        ))}
      </div>
    )}
 </SectionCard>
</div>


  <div id="jobs">
    
  <SectionCard title="Jobs">
    <section
  style={{
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "24px",
    border: "1px solid #e5e7eb",
  }}
></section>

  {jobsLoading && (
    <p>Loading jobs...</p>
  )}

  {jobsError && (
    <p>{jobsError}</p>
  )}

  {!jobsLoading &&
    !jobsError &&
    jobs.length === 0 && (
      <p>No jobs found.</p>
    )}

  {!jobsLoading &&
    !jobsError &&
    jobs.length > 0 && (
      <div
        style={{
          marginTop: "16px",
        }}
      >
        {jobs.map((job) => (
          <article
            key={job.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "18px",
              marginBottom: "16px",
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
              <strong>Eligible Department:</strong>{" "}
              {job.eligibleDepartment}
            </p>

            <p>
              <strong>Required Skills:</strong>{" "}
              {job.requiredSkills || "Not specified"}
            </p>

            <p>
              <strong>Application Deadline:</strong>{" "}
              {job.applicationDeadline}
            </p>

            <button
  onClick={() =>
    handleEditJob(job)
  }
>
  Edit
</button>

  <button onClick={() => handleDeleteJob(job.id)}>
    Delete
  </button>

  

          </article>
          
          
        ))}
        

        
      </div>
      
      
    )}
    
    
</SectionCard>
</div>


</div>

    </div>
    
  )}

  <div id="applications">
  <SectionCard title="Applications">

    {applicationStatusSuccess && (
  <p style={{ color: "green", marginBottom: "12px" }}>
    {applicationStatusSuccess}
  </p>
)}

{applicationStatusError && (
  <p style={{ color: "red", marginBottom: "12px" }}>
    {applicationStatusError}
  </p>
)}

<div
  style={{
    className:"application-filters",
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "12px",
    marginBottom: "20px",
  }}
>
  <input
    type="text"
    placeholder="Search by student, USN, job, or company"
    value={applicationSearch}
    onChange={(event) =>
      setApplicationSearch(event.target.value)
    }
  />

  <select
    value={applicationStatusFilter}
    onChange={(event) =>
      setApplicationStatusFilter(event.target.value)
    }
  >
    <option value="ALL">All Statuses</option>
    <option value="APPLIED">Applied</option>
    <option value="SHORTLISTED">Shortlisted</option>
    <option value="SELECTED">Selected</option>
    <option value="REJECTED">Rejected</option>
  </select>
</div>

  {applicationsLoading && <p>Loading applications...</p>}

  {applicationsError && (
    <p style={{ color: "red" }}>
      {applicationsError}
    </p>
  )}

  {!applicationsLoading &&
  !applicationsError &&
  applications.length > 0 &&
  filteredApplications.length === 0 && (
    <p>No applications match your filters.</p>
  )}

  {!applicationsLoading &&
    !applicationsError &&
    applications.length === 0 && (
      <p>No applications found.</p>
    )}

  {!applicationsLoading &&
    !applicationsError &&
    applications.length > 0 && (
      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        {filteredApplications.map((application) => (
          <div
            key={application.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "18px",
              backgroundColor: "#f9fafb",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>
              {application.studentName}
            </h3>

            <p>
              <strong>USN:</strong>{" "}
              {application.studentUsn}
            </p>

            <p>
              <strong>Job:</strong>{" "}
              {application.jobTitle}
            </p>

            <p>
              <strong>Company:</strong>{" "}
              {application.companyName}
            </p>

            <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "12px",
    flexWrap: "wrap",
  }}
>
  <strong>Status:</strong>

  <StatusBadge status={application.status} />

  <select
    defaultValue={application.status}
    onChange={(event) =>
      handleApplicationStatusUpdate(
        application.id,
        event.target.value
      )
    }
    disabled={updatingApplicationId === application.id}
  >
    <option value="APPLIED">APPLIED</option>
    <option value="SHORTLISTED">SHORTLISTED</option>
    <option value="SELECTED">SELECTED</option>
    <option value="REJECTED">REJECTED</option>
  </select>

  {updatingApplicationId === application.id && (
    <span>Updating...</span>
  )}
</div>

            <p>
              <strong>Applied At:</strong>{" "}
              {new Date(application.appliedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    )}
</SectionCard>
</div>

<div id="interviews">
<SectionCard title="Schedule Interview">
  {interviewSuccess && (
    <p style={{ color: "green", marginBottom: "12px" }}>
      {interviewSuccess}
    </p>
  )}

  {interviewFormError && (
    <p style={{ color: "red", marginBottom: "12px" }}>
      {interviewFormError}
    </p>
  )}

  <form onSubmit={handleScheduleInterview}>
    <div
      style={{
        display: "grid",
        gap: "14px",
      }}
    >
      <div>
        <label>Application</label>

        <select
          name="applicationId"
          value={interviewForm.applicationId}
          onChange={handleInterviewChange}
          required
          style={{ width: "100%" }}
        >
          <option value="">
            Select an application
          </option>

          {applications.map((application) => (
            <option
              key={application.id}
              value={application.id}
            >
              {application.studentName} —{" "}
              {application.jobTitle} —{" "}
              {application.companyName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Interview Date & Time</label>

        <input
          type="datetime-local"
          name="interviewDateTime"
          value={interviewForm.interviewDateTime}
          onChange={handleInterviewChange}
          required
        />
      </div>

      <div>
        <label>Mode</label>

        <select
          name="mode"
          value={interviewForm.mode}
          onChange={handleInterviewChange}
        >
          <option value="">Select mode</option>
          <option value="ONLINE">Online</option>
          <option value="OFFLINE">Offline</option>
        </select>
      </div>

      <div>
        <label>Meeting Link</label>

        <input
          type="url"
          name="meetingLink"
          value={interviewForm.meetingLink}
          onChange={handleInterviewChange}
          placeholder="https://..."
        />
      </div>

      <div>
        <label>Interviewer Name</label>

        <input
          type="text"
          name="interviewerName"
          value={interviewForm.interviewerName}
          onChange={handleInterviewChange}
          placeholder="Enter interviewer name"
        />
      </div>

      <button
        type="submit"
        disabled={interviewSaving}
      >
        {interviewSaving
          ? "Scheduling..."
          : "Schedule Interview"}
      </button>
    </div>
  </form>
</SectionCard>

<SectionCard title="Scheduled Interviews">
    {interviewActionSuccess && (
  <p
    style={{
      color: "green",
      marginBottom: "12px",
    }}
  >
    {interviewActionSuccess}
  </p>
)}

{interviewActionError && (
  <p
    style={{
      color: "red",
      marginBottom: "12px",
    }}
  >
    {interviewActionError}
  </p>
)}
  {interviewsLoading && (
    <p>Loading interviews...</p>
  )}

  {interviewsError && (
    <p style={{ color: "red" }}>
      {interviewsError}
    </p>
  )}

  {!interviewsLoading &&
    !interviewsError &&
    interviews.length === 0 && (
      <p>No interviews scheduled.</p>
    )}

  {!interviewsLoading &&
    !interviewsError &&
    interviews.length > 0 && (
      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        {interviews.map((interview) => (
          <div
            key={interview.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "18px",
              backgroundColor: "#f9fafb",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>
              {interview.studentName}
            </h3>

            <p>
              <strong>USN:</strong>{" "}
              {interview.studentUsn}
            </p>

            <p>
              <strong>Job:</strong>{" "}
              {interview.jobTitle}
            </p>

            <p>
              <strong>Company:</strong>{" "}
              {interview.companyName}
            </p>

            <p>
              <strong>Date & Time:</strong>{" "}
              {new Date(
                interview.interviewDateTime
              ).toLocaleString()}
            </p>

            <p>
              <strong>Mode:</strong>{" "}
              {interview.mode || "Not specified"}
            </p>

            <p>
              <strong>Interviewer:</strong>{" "}
              {interview.interviewerName ||
                "Not specified"}
            </p>

            <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "12px",
    flexWrap: "wrap",
  }}
>
  <strong>Status:</strong>

  <StatusBadge status={interview.status} />

  <select
    defaultValue={interview.status}
    onChange={(event) =>
      handleInterviewStatusUpdate(
        interview.id,
        event.target.value
      )
    }
    disabled={
      updatingInterviewId === interview.id ||
      cancellingInterviewId === interview.id
    }
  >
    <option value="SCHEDULED">Scheduled</option>
    <option value="COMPLETED">Completed</option>
    <option value="CANCELLED">Cancelled</option>
  </select>

  {interview.status === "SCHEDULED" && (
    <button
      onClick={() =>
        handleCancelInterview(interview.id)
      }
      disabled={
        cancellingInterviewId === interview.id ||
        updatingInterviewId === interview.id
      }
    >
      {cancellingInterviewId === interview.id
        ? "Cancelling..."
        : "Cancel Interview"}
    </button>
  )}

  {updatingInterviewId === interview.id && (
    <span>Updating...</span>
  )}
</div>

            {interview.meetingLink && (
              <p>
                <strong>Meeting Link:</strong>{" "}
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Meeting
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
    )}
</SectionCard>
</div>
  
</main>
    </>
  );
  
}

export default AdminDashboard;