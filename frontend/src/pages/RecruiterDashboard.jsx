import { useEffect, useState } from "react";
import { getRecruiterDashboard } from "../services/dashboardService";

function RecruiterDashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data = await getRecruiterDashboard();
                setDashboard(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
    <div className="recruiter-dashboard">

        <div className="recruiter-dashboard-header">
            <div>
                <h1>Recruiter Dashboard</h1>
                <p>
                    Overview of your company's placement activity.
                </p>
            </div>
        </div>

        <div className="recruiter-stats-grid">

            <div className="recruiter-stat-card">
                <div className="recruiter-stat-icon">💼</div>
                <div>
                    <p>Job Openings</p>
                    <h2>{dashboard.totalJobs}</h2>
                </div>
            </div>

            <div className="recruiter-stat-card">
                <div className="recruiter-stat-icon">👥</div>
                <div>
                    <p>Candidates</p>
                    <h2>{dashboard.totalApplications}</h2>
                </div>
            </div>

            <div className="recruiter-stat-card">
                <div className="recruiter-stat-icon">✓</div>
                <div>
                    <p>Selected</p>
                    <h2>{dashboard.totalSelected}</h2>
                </div>
            </div>

            <div className="recruiter-stat-card">
                <div className="recruiter-stat-icon">📅</div>
                <div>
                    <p>Scheduled Interviews</p>
                    <h2>{dashboard.totalScheduledInterviews}</h2>
                </div>
            </div>

        </div>

        <div className="recruiter-quick-actions">

            <h2>Quick Actions</h2>

            <div className="recruiter-action-grid">

                <a href="/recruiter/jobs">
                    <strong>Manage Jobs</strong>
                    <span>Create and manage job openings</span>
                </a>

                <a href="/recruiter/applications">
                    <strong>Review Candidates</strong>
                    <span>View and manage applications</span>
                </a>

                <a href="/recruiter/interviews">
                    <strong>Manage Interviews</strong>
                    <span>Schedule and track interviews</span>
                </a>

            </div>

        </div>

    </div>
);
}

export default RecruiterDashboard;