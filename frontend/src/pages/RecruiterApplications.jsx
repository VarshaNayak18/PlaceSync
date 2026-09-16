import { useEffect, useState } from "react";
import {
    getRecruiterApplications,
    updateRecruiterApplicationStatus
} from "../services/applicationService";

function RecruiterApplications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusUpdatingId, setStatusUpdatingId] = useState(null);

    useEffect(() => {
        const loadApplications = async () => {
            try {
                const data = await getRecruiterApplications();
                setApplications(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load applications.");
            } finally {
                setLoading(false);
            }
        };

        loadApplications();
    }, []);

    const handleStatusChange = async (id, status) => {
    setStatusUpdatingId(id);
    setError("");

    try {
        const updatedApplication =
            await updateRecruiterApplicationStatus(id, status);

        setApplications((previous) =>
            previous.map((application) =>
                application.id === id
                    ? updatedApplication
                    : application
            )
        );

    } catch (err) {
        console.error(err);
        setError("Failed to update application status.");
    } finally {
        setStatusUpdatingId(null);
    }
};

    if (loading) {
        return <p>Loading applications...</p>;
    }

    if (error && applications.length === 0) {
        return <p>{error}</p>;
    }

    return (
        <div className="recruiter-jobs-page">

            <div className="recruiter-jobs-header">
                <div>
                    <h1>Candidate Applications</h1>
                    <p>
                        Review and manage candidates who applied
                        to your company's jobs.
                    </p>
                </div>
            </div>

            {error && (
                <p>{error}</p>
            )}

            {applications.length === 0 ? (
                <div className="recruiter-empty-state">
                    <p>No applications found.</p>
                </div>
            ) : (
                <div className="recruiter-job-list">

                    {applications.map((application) => (
                        <div
                            className="recruiter-job-card"
                            key={application.id}
                        >

                            <h2>
                                {application.studentName}
                            </h2>

                            <p className="recruiter-job-detail">
                                <strong>USN:</strong>{" "}
                                {application.studentUsn}
                            </p>

                            <p className="recruiter-job-detail">
                                <strong>Applied For:</strong>{" "}
                                {application.jobTitle}
                            </p>

                            <p className="recruiter-job-detail">
                                <strong>Applied On:</strong>{" "}
                                {new Date(
                                    application.appliedAt
                                ).toLocaleString()}
                            </p>

                            <p className="recruiter-job-detail">
    <strong>Status:</strong>{" "}
    <span className={`application-status ${application.status.toLowerCase()}`}>
        {application.status}
    </span>
</p>

                            <div className="recruiter-job-actions">

                                <div className="recruiter-job-actions">

    {application.status === "APPLIED" && (
        <>
            <button
    type="button"
    className="recruiter-edit-button"
    onClick={() =>
        handleStatusChange(
            application.id,
            "SHORTLISTED"
        )
    }
    disabled={statusUpdatingId === application.id}
>
    {statusUpdatingId === application.id
        ? "Updating..."
        : "Shortlist"}
</button>

            <button
    type="button"
    className="recruiter-delete-button"
    onClick={() =>
        handleStatusChange(
            application.id,
            "REJECTED"
        )
    }
    disabled={statusUpdatingId === application.id}
>
    {statusUpdatingId === application.id
        ? "Updating..."
        : "Reject"}
</button>
        </>
    )}

    {application.status === "SHORTLISTED" && (
        <>
            <button
    type="button"
    className="recruiter-primary-button"
    onClick={() =>
        handleStatusChange(
            application.id,
            "SELECTED"
        )
    }
    disabled={statusUpdatingId === application.id}
>
    {statusUpdatingId === application.id
        ? "Updating..."
        : "Select"}
</button>

            <button
    type="button"
    className="recruiter-delete-button"
    onClick={() =>
        handleStatusChange(
            application.id,
            "REJECTED"
        )
    }
    disabled={statusUpdatingId === application.id}
>
    {statusUpdatingId === application.id
        ? "Updating..."
        : "Reject"}
</button>
        </>
    )}

    {application.status === "SELECTED" && (
        <span>
            Candidate selected
        </span>
    )}

    {application.status === "REJECTED" && (
        <span>
            Application rejected
        </span>
    )}

</div>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default RecruiterApplications;