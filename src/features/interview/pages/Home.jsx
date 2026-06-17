import React, { useState, useRef } from 'react';
import '../styles/home.scss';
import { useInterview } from '../hooks/useInterview.js';
import { useNavigate } from 'react-router';
import { logout } from "../../auth/services/auth.api";

const Home = () => {
    const { generateReport, generating, fetching, reports } = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef();

    const navigate = useNavigate();

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0];
        const data = await generateReport({ jobDescription, selfDescription, resumeFile });
        navigate(`/interview/${data._id}`);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    if (fetching) {
        return (
            <main className="loading-screen">
                <p>Loading Home Screen...</p>
            </main>
        );
    }

    if (generating) {
        return (
            <main className="loading-screen">
                <p>Generating your interview plan...</p>
            </main>
        );
    }

    return (
        <main className="home">
            {/* Header Section */}
            <div className="header-section">
                <div className="header-content">
                    <h1 className="main-title">
                        Create Your Custom Interview Plan
                    </h1>

                    <p className="subtitle">
                        Let our AI analyze the job requirements and your unique profile to build a winning strategy.
                    </p>
                </div>

                <button className="btn-logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Grouped: Input boxes + Generate footer in one card */}
            <div className="action-card">
                {/* Main Content */}
                <div className="interview-input-group">
                    {/* Left Section - Job Description */}
                    <div className="left-section">
                        <div className="section-header">
                            <span className="section-icon">📋</span>
                            <h2 className="section-title">Target Job Description</h2>
                            <span className="badge required">REQUIRED</span>
                        </div>
                        <p className="section-description">
                            Paste the full job description here - e.g., Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...
                        </p>
                        <textarea
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            name="jobDescription"
                            id="jobDescription"
                            className="job-textarea"
                            placeholder="Paste job description here..."
                        ></textarea>
                    </div>

                    {/* Right Section - User Profile */}
                    <div className="right-section">
                        {/* Resume Upload Section */}
                        <div className="profile-subsection">
                            <div className="subsection-header">
                                <h3 className="subsection-title">Your Profile</h3>
                                <span className="badge best-results">BEST RESULTS</span>
                            </div>

                            <div className="upload-section">
                                <h4 className="upload-title">UPLOAD RESUME</h4>
                                <label className="file-upload-area" htmlFor="resume">
                                    <div className="upload-content">
                                        <div className="cloud-icon">☁️</div>
                                        <p className="upload-text">Click to upload or drag & drop PDF or DOCX</p>
                                    </div>
                                </label>
                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type="file"
                                    name="resume"
                                    id="resume"
                                    accept=".pdf,.docx"
                                />
                            </div>

                            {/* OR Divider */}
                            <div className="or-divider">
                                <span>AND</span>
                            </div>

                            {/* Self Description Section */}
                            <div className="self-description-section">
                                <h4 className="self-description-title">QUICK SELF-DESCRIPTION</h4>
                                <textarea
                                    onChange={(e) => { setSelfDescription(e.target.value) }}
                                    name="selfDescription"
                                    id="selfDescription"
                                    className="self-description-textarea"
                                    placeholder="Briefly describe your key experience, skills, and goals..."
                                    maxLength="5000"
                                ></textarea>
                                <div className="char-count">
                                    <span className="current-count">0</span>
                                    <span> / 5000 chars</span>
                                </div>

                                {/* Info Message */}
                                <div className="info-message">
                                    <span className="info-icon">ℹ️</span>
                                    <p>Both Resume and Self Description is required for a personalized plan.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="footer-section">
                    <div className="footer-left">
                        <span className="ai-badge">⚡ AI-Powered Strategy Generation • Approx 30s</span>
                    </div>
                    <button className="btn-generate" onClick={handleGenerateReport} disabled={generating}>
                        <span className="btn-icon">🚀</span>
                        Generate My Interview Strategy
                    </button>
                </div>
            </div>

            {/*Recent Reports List */}
            {reports.length > 0 && (
                <div className="recent-reports">
                    <h3 className="reports-title">Your Recent Interview Plans</h3>
                    <div className="reports-grid">
                        {reports.map((r) => (
                            <div
                                key={r._id}
                                className="report-card"
                                onClick={() => navigate(`/interview/${r._id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <h4>• {r.title}</h4>
                                <p>{r.description}</p>
                                <p className="report-date">
                                    Generated on {new Date(r.createdAt).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </p>
                                <p className={`match-score`}>
                                    Match Score: {r.matchScore}%
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
};

export default Home;
