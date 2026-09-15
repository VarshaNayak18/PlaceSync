import { useEffect, useState } from "react";
import {
    getRecruiterInterviews,
    scheduleRecruiterInterview,
    updateRecruiterInterviewStatus
} from "../services/interviewService";
import { getRecruiterApplications } from "../services/applicationService";

function RecruiterInterviews() {

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [applications, setApplications] = useState([]);
const [showForm, setShowForm] = useState(false);
const [submitting, setSubmitting] = useState(false);

const [formData, setFormData] = useState({
    applicationId: "",
    interviewDateTime: "",
    mode: "",
    meetingLink: "",
    interviewerName: ""
});

const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
        ...previous,
        [name]: value
    }));
};

const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
        const createdInterview =
            await scheduleRecruiterInterview({
                ...formData,
                applicationId: Number(formData.applicationId)
            });

        setInterviews((previous) => [
            ...previous,
            createdInterview
        ]);

        setFormData({
            applicationId: "",
            interviewDateTime: "",
            mode: "",
            meetingLink: "",
            interviewerName: ""
        });

        setShowForm(false);

    } catch (err) {
        console.error(err);
        setError("Failed to schedule interview.");
    } finally {
        setSubmitting(false);
    }
};

    useEffect(() => {
    const loadData = async () => {
        try {
            const [interviewData, applicationData] =
                await Promise.all([
                    getRecruiterInterviews(),
                    getRecruiterApplications()
                ]);

            setInterviews(interviewData);
            setApplications(applicationData);
        } catch (err) {
            console.error(err);
            setError("Failed to load interview data.");
        } finally {
            setLoading(false);
        }
    };

    loadData();
}, []);;

    const handleStatusChange = async (id, status) => {
        try {
            const updatedInterview =
                await updateRecruiterInterviewStatus(id, status);

            setInterviews((previous) =>
                previous.map((interview) =>
                    interview.id === id
                        ? updatedInterview
                        : interview
                )
            );

        } catch (err) {
            console.error(err);
            setError("Failed to update interview status.");
        }
    };

    if (loading) {
        return <p>Loading interviews...</p>;
    }

    if (error && interviews.length === 0) {
        return <p>{error}</p>;
    }

    return (
        <div className="recruiter-jobs-page">

            <div className="recruiter-jobs-header">
                <div>
                    <h1>Interviews</h1>
                    <p>
                        Manage interviews scheduled for your candidates.
                    </p>
                </div>

                <button
    type="button"
    className="recruiter-primary-button"
    onClick={() => setShowForm((previous) => !previous)}
>
    {showForm ? "Cancel" : "Schedule Interview"}
</button>
            </div>

            {showForm && (
    <form
        className="recruiter-job-form"
        onSubmit={handleSubmit}
    >
        <h2>Schedule Interview</h2>

        <div className="recruiter-form-grid">

            <div className="recruiter-form-group full-width">
                <label>Candidate / Application</label>

                <select
                    name="applicationId"
                    value={formData.applicationId}
                    onChange={handleChange}
                    required
                >
                    <option value="">
                        Select a candidate
                    </option>

                    {applications
                        .filter(
                            (application) =>
                                application.status ===
                                "SHORTLISTED"
                        )
                        .map((application) => (
                            <option
                                key={application.id}
                                value={application.id}
                            >
                                {application.studentName} —{" "}
                                {application.jobTitle}
                            </option>
                        ))}
                </select>
            </div>

            <div className="recruiter-form-group">
                <label>Interview Date & Time</label>

                <input
                    type="datetime-local"
                    name="interviewDateTime"
                    value={formData.interviewDateTime}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="recruiter-form-group">
                <label>Mode</label>

                <input
                    type="text"
                    name="mode"
                    placeholder="e.g. Online / In-person"
                    value={formData.mode}
                    onChange={handleChange}
                />
            </div>

            <div className="recruiter-form-group">
                <label>Meeting Link</label>

                <input
                    type="url"
                    name="meetingLink"
                    placeholder="https://..."
                    value={formData.meetingLink}
                    onChange={handleChange}
                />
            </div>

            <div className="recruiter-form-group">
                <label>Interviewer Name</label>

                <input
                    type="text"
                    name="interviewerName"
                    placeholder="e.g. John Smith"
                    value={formData.interviewerName}
                    onChange={handleChange}
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
                    ? "Scheduling..."
                    : "Schedule Interview"}
            </button>

            <button
                type="button"
                className="recruiter-cancel-button"
                onClick={() => setShowForm(false)}
            >
                Cancel
            </button>

        </div>

    </form>
)}

            {error && (
                <p>{error}</p>
            )}

            {interviews.length === 0 ? (
                <div className="recruiter-empty-state">
                    <p>No interviews scheduled.</p>
                </div>
            ) : (
                <div className="recruiter-job-list">

                    {interviews.map((interview) => (
                        <div
                            className="recruiter-job-card"
                            key={interview.id}
                        >

                            <h2>
                                {interview.studentName}
                            </h2>

                            <p className="recruiter-job-detail">
                                <strong>USN:</strong>{" "}
                                {interview.studentUsn}
                            </p>

                            <p className="recruiter-job-detail">
                                <strong>Job:</strong>{" "}
                                {interview.jobTitle}
                            </p>

                            <p className="recruiter-job-detail">
                                <strong>Date & Time:</strong>{" "}
                                {new Date(
                                    interview.interviewDateTime
                                ).toLocaleString()}
                            </p>

                            <p className="recruiter-job-detail">
                                <strong>Mode:</strong>{" "}
                                {interview.mode || "Not specified"}
                            </p>

                            <p className="recruiter-job-detail">
                                <strong>Interviewer:</strong>{" "}
                                {interview.interviewerName ||
                                    "Not specified"}
                            </p>

                            {interview.meetingLink && (
                                <p className="recruiter-job-detail">
                                    <strong>Meeting Link:</strong>{" "}
                                    <a
                                        href={interview.meetingLink}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Join Meeting
                                    </a>
                                </p>
                            )}

                            <p className="recruiter-job-detail">
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`application-status ${interview.status.toLowerCase()}`}
                                >
                                    {interview.status}
                                </span>
                            </p>

                            <div className="recruiter-job-actions">

                                {interview.status === "SCHEDULED" && (
                                    <>
                                        <button
                                            type="button"
                                            className="recruiter-primary-button"
                                            onClick={() =>
                                                handleStatusChange(
                                                    interview.id,
                                                    "COMPLETED"
                                                )
                                            }
                                        >
                                            Mark Completed
                                        </button>

                                        <button
                                            type="button"
                                            className="recruiter-delete-button"
                                            onClick={() =>
                                                handleStatusChange(
                                                    interview.id,
                                                    "CANCELLED"
                                                )
                                            }
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}

                                {interview.status === "COMPLETED" && (
                                    <span>
                                        Interview completed
                                    </span>
                                )}

                                {interview.status === "CANCELLED" && (
                                    <span>
                                        Interview cancelled
                                    </span>
                                )}

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default RecruiterInterviews;