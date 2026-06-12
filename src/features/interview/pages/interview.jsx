import React, { useState, useEffect } from 'react';
import '../styles/interview.scss';
import { useInterview } from '../hooks/useInterview.js';
import { useNavigate, useParams } from 'react-router';



const Interview = () => {
    const [activeTab, setActiveTab] = useState('technical');
    const [selectedDay, setSelectedDay] = useState(1);
    const [selectedQuestion, setSelectedQuestion] = useState(0); // ← NEW: tracks which question is active
    const { report, getReportById, fetching, getResumePdf, generating } = useInterview();
    const { interviewId } = useParams();

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        }
    }, [interviewId]);

    if (fetching || !report) {
        return (
            <main className="loading-screen">
                <p>Loading your interview plan...</p>
            </main>
        );
    }


    // Reset question index when switching tabs so we never show an out-of-bounds index
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedQuestion(0);
    };

    const getCurrentContent = () => {
        if (activeTab === 'technical') {
            return report.technicalQuestions[selectedQuestion]; // ← uses state, not hardcoded 0
        } else if (activeTab === 'behavioral') {
            return report.behavioralQuestions[selectedQuestion]; // ← uses state, not hardcoded 0
        } else {
            return report.preparationPlan[selectedDay - 1];
        }
    };

    const content = getCurrentContent();

    // The list of questions for whichever tab is currently active
    const activeQuestions =
        activeTab === 'technical'
            ? report.technicalQuestions
            : report.behavioralQuestions;

    return (
        <main className="interview">
            <div className="interview-container">
                {/* Left Sidebar Navigation */}
                <aside className="interview-sidebar-left">
                    <div className="sidebar-header">
                        <h3 className="sidebar-title">Plan Navigation</h3>
                    </div>

                    <div className="nav-buttons">
                        <button
                            className={`nav-button ${activeTab === 'technical' ? 'active' : ''}`}
                            onClick={() => handleTabChange('technical')} // ← handleTabChange resets selectedQuestion
                        >
                            Technical questions
                        </button>
                        <button
                            className={`nav-button ${activeTab === 'behavioral' ? 'active' : ''}`}
                            onClick={() => handleTabChange('behavioral')}
                        >
                            Behavioral questions
                        </button>
                        <button
                            className={`nav-button ${activeTab === 'preparation' ? 'active' : ''}`}
                            onClick={() => handleTabChange('preparation')}
                        >
                            Road Map
                        </button>
                    </div>

                    <div className="nav-summary">
                        <span className="summary-label">Questions total</span>
                        <strong className="summary-number">
                            {report.technicalQuestions.length + report.behavioralQuestions.length}
                        </strong>
                    </div>

                    <button
                        className="btn-download-pdf"
                        onClick={() => getResumePdf(interviewId)}
                        disabled={generating}
                    >
                        {generating ? 'Generating...' : '⬇ Download Resume PDF'}
                    </button>
                </aside>

                {/* Main Content Area */}
                <section className="interview-main">
                    <div className="main-header">
                        <div>
                            <span className="header-tag">Interview Strategy</span>
                            <h1 className="header-title">Your personalized preparation board</h1>
                        </div>
                        <div className="match-score-box">
                            <span className="score-label">Match Score</span>
                            <strong className="score-value">{report.matchScore}%</strong>
                            <span className={`score-level ${report.matchScore < 60 ? 'low' : report.matchScore <= 80 ? 'medium' : 'high'}`}>
                                {report.matchScore < 60 ? 'Low' : report.matchScore <= 80 ? 'Medium' : 'High'}
                            </span>
                        </div>
                    </div>

                    <div className="main-content">
                        {activeTab === 'preparation' ? (
                            <div className="preparation-section">
                                <div className="day-selector">
                                    {report.preparationPlan.map((plan) => (
                                        <button
                                            key={plan.day}
                                            className={`day-button ${selectedDay === plan.day ? 'active' : ''}`}
                                            onClick={() => setSelectedDay(plan.day)}
                                        >
                                            Day {plan.day}
                                        </button>
                                    ))}
                                </div>

                                <div className="day-content">
                                    <h2 className="day-title">Day {content.day}: {content.focus}</h2>
                                    <ul className="day-tasks">
                                        {content.tasks.map((task, idx) => (
                                            <li key={idx} className="task-item">{task}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="question-section">
                                {/* ← NEW: question selector, mirrors the day-selector pattern */}
                                <div className="day-selector">
                                    {activeQuestions.map((_, idx) => (
                                        <button
                                            key={idx}
                                            className={`day-button ${selectedQuestion === idx ? 'active' : ''}`}
                                            onClick={() => setSelectedQuestion(idx)}
                                        >
                                            Q{idx + 1}
                                        </button>
                                    ))}
                                </div>

                                <div className="question-card">
                                    <span className="card-label">
                                        {activeTab === 'technical' ? 'Featured Technical Question' : 'Behavioral Question'}
                                    </span>
                                    <h2 className="question-text">{content.question}</h2>
                                    <div className="question-meta">
                                        <p className="meta-label">Intention:</p>
                                        <p className="meta-text">{content.intention}</p>
                                    </div>
                                </div>

                                <div className="answer-card">
                                    <span className="card-label">Sample Answer</span>
                                    <p className="answer-text">{content.answer}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Right Sidebar - Skill Gaps */}
                <aside className="interview-sidebar-right">
                    <div className="sidebar-header">
                        <h3 className="sidebar-title">Skill Gaps</h3>
                    </div>
                    <p className="severity-hint">🔴 High severity gaps highlighted with red need immediate attention</p>

                    <div className="skills-list">
                        {report.skillGaps.map((gap, idx) => (
                            <span
                                key={idx}
                                className={`skill-badge severity-${gap.severity}`}
                            >
                                {gap.skill}
                            </span>
                        ))}
                    </div>

                    <div className="sidebar-tip">
                        <span className="tip-label">Quick Tip</span>
                        <p className="tip-text">
                            Focus on these gaps first and align your study sessions with the company's backend expectations.
                        </p>
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default Interview;
