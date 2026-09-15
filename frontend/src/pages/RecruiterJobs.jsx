import { useEffect, useState } from "react";
import {
    getRecruiterJobs,
    createRecruiterJob,
    updateRecruiterJob,
    deleteRecruiterJob
} from "../services/jobService";

function RecruiterJobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        salary: "",
        minimumCgpa: "",
        eligibleDepartment: "",
        requiredSkills: "",
        applicationDeadline: ""
    });
    
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [editingJobId, setEditingJobId] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleEdit = (job) => {
    setEditingJobId(job.id);

    setFormData({
        title: job.title || "",
        description: job.description || "",
        location: job.location || "",
        salary: job.salary || "",
        minimumCgpa: job.minimumCgpa || "",
        eligibleDepartment: job.eligibleDepartment || "",
        requiredSkills: job.requiredSkills || "",
        applicationDeadline: job.applicationDeadline
            ? `${job.applicationDeadline}T09:00`
            : ""
    });

    setFormError("");
    setShowForm(true);
};

const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
        return;
    }

    try {
        await deleteRecruiterJob(jobId);

        setJobs((previous) =>
            previous.filter((job) => job.id !== jobId)
        );

    } catch (err) {
        console.error(err);
        setError("Failed to delete job.");
    }
};

    const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");
    setSubmitting(true);

    try {
        const jobData = {
            ...formData,
            salary: Number(formData.salary),
            minimumCgpa: Number(formData.minimumCgpa),
            applicationDeadline:
                formData.applicationDeadline.split("T")[0]
        };

        if (editingJobId) {

            const updatedJob = await updateRecruiterJob(
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

        } else {

            const createdJob =
                await createRecruiterJob(jobData);

            setJobs((previous) => [
                ...previous,
                createdJob
            ]);
        }

        setFormData({
            title: "",
            description: "",
            location: "",
            salary: "",
            minimumCgpa: "",
            eligibleDepartment: "",
            requiredSkills: "",
            applicationDeadline: ""
        });

        setEditingJobId(null);
        setShowForm(false);

    } catch (err) {
        console.error(err);
        setFormError(
            editingJobId
                ? "Failed to update job."
                : "Failed to create job."
        );
    } finally {
        setSubmitting(false);
    }
};

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const data = await getRecruiterJobs();
                setJobs(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load job openings.");
            } finally {
                setLoading(false);
            }
        };

        loadJobs();
    }, []);

    if (loading) {
        return <p>Loading job openings...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="recruiter-jobs-page">

            <div className="recruiter-jobs-header">
    <div>
        <h1>Job Openings</h1>
        <p>Manage jobs posted by your company.</p>
    </div>

    <button
        type="button"
        className="recruiter-primary-button"
        onClick={() => setShowForm((previous) => !previous)}
    >
        {showForm ? "Cancel" : "Create Job"}
    </button>
</div>

            {showForm && (
    <form
    onSubmit={handleSubmit}
    className="recruiter-job-form"
>
    <h2>
        {editingJobId ? "Edit Job" : "Create Job"}
    </h2>

    {formError && (
        <p>{formError}</p>
    )}

    <div className="recruiter-form-grid">

        <div className="recruiter-form-group">
            <label>Job Title</label>
            <input
                type="text"
                name="title"
                placeholder="e.g. Software Engineer Intern"
                value={formData.title}
                onChange={handleChange}
                required
            />
        </div>

        <div className="recruiter-form-group">
            <label>Location</label>
            <input
                type="text"
                name="location"
                placeholder="e.g. Bengaluru"
                value={formData.location}
                onChange={handleChange}
                required
            />
        </div>

        <div className="recruiter-form-group">
            <label>Salary</label>
            <input
                type="number"
                name="salary"
                placeholder="e.g. 600000"
                value={formData.salary}
                onChange={handleChange}
                required
            />
        </div>

        <div className="recruiter-form-group">
            <label>Minimum CGPA</label>
            <input
                type="number"
                name="minimumCgpa"
                placeholder="e.g. 7.5"
                step="0.01"
                value={formData.minimumCgpa}
                onChange={handleChange}
                required
            />
        </div>

        <div className="recruiter-form-group">
            <label>Eligible Department</label>
            <input
                type="text"
                name="eligibleDepartment"
                placeholder="e.g. CSE"
                value={formData.eligibleDepartment}
                onChange={handleChange}
                required
            />
        </div>

        <div className="recruiter-form-group">
            <label>Required Skills</label>
            <input
                type="text"
                name="requiredSkills"
                placeholder="e.g. Java, Spring Boot, MySQL"
                value={formData.requiredSkills}
                onChange={handleChange}
            />
        </div>

        <div className="recruiter-form-group full-width">
            <label>Job Description</label>
            <textarea
                name="description"
                placeholder="Describe the role and responsibilities..."
                value={formData.description}
                onChange={handleChange}
                required
            />
        </div>

        <div className="recruiter-form-group">
            <label>Application Deadline</label>
            <input
                type="datetime-local"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                required
            />
        </div>

    </div>

    <div className="recruiter-form-actions">

        <button
            type="submit"
            className="recruiter-primary-button"
            disabled={submitting}
        >
            {submitting
                ? "Saving..."
                : editingJobId
                    ? "Save Changes"
                    : "Create Job"}
        </button>

        {editingJobId && (
            <button
                type="button"
                className="recruiter-cancel-button"
                onClick={() => {
                    setEditingJobId(null);
                    setShowForm(false);
                    setFormError("");
                }}
            >
                Cancel
            </button>
        )}

    </div>

</form>
)}

            {jobs.length === 0 ? (
                <div className="recruiter-empty-state">
    <p>No job openings found.</p>
    <p>Create your first job opening to start recruiting.</p>
</div>
            ) : (
                <div className="recruiter-job-list">

                    {jobs.map((job) => (
                        <div className="recruiter-job-card" key={job.id}>

                            <h2>{job.title}</h2>

                            <p className="recruiter-job-detail">
                                <strong>Location:</strong>{" "}
                                {job.location}
                            </p>

                            <p className="recruiter-job-detail">
                                <strong>Salary:</strong>{" "}
                                {job.salary}
                            </p>

                            <p className="recruiter-job-detail">
                                <strong>Minimum CGPA:</strong>{" "}
                                {job.minimumCgpa}
                            </p>

                            <p className="recruiter-job-detail">
                                <strong>Department:</strong>{" "}
                                {job.eligibleDepartment}
                            </p>

                            <p className="recruiter-job-detail">
                                <strong>Required Skills:</strong>{" "}
                                {job.requiredSkills}
                            </p>

                            <p className="recruiter-job-detail">
                                <strong>Deadline:</strong>{" "}
                                {job.applicationDeadline}
                            </p>

                            <div className="recruiter-job-actions">

    <button
        type="button"
        className="recruiter-edit-button"
        onClick={() => handleEdit(job)}
    >
        Edit
    </button>

    <button
        type="button"
        className="recruiter-delete-button"
        onClick={() => handleDelete(job.id)}
    >
        Delete
    </button>

</div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default RecruiterJobs;