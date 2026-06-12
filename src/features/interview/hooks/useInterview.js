import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";



export const useInterview = () => {

    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, generating, setGenerating, fetching, setFetching, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setGenerating(true); // ← was setLoading
        let response = null;
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            setReport(response.interviewReport);
        } catch (err) {
            console.error("Error generating interview report:", err);
        } finally {
            setGenerating(false); // ← was setLoading
        }
        return response.interviewReport;
    }

    const getReportById = async (interviewId) => {
        setFetching(true); // ← was setLoading
        let response = null;
        try {
            response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport);
        } catch (err) {
            console.error("Error fetching interview report by ID:", err);
        } finally {
            setFetching(false); // ← was setLoading
        }
        return response.interviewReport;
    };

    const getReports = async () => {
        setFetching(true); // ← was setLoading
        let response = null;
        try {
            response = await getAllInterviewReports();
            setReports(response.interviewReports);
        } catch (err) {
            console.error("Error fetching interview reports:", err);
        } finally {
            setFetching(false); // ← was setLoading
        }
        return response.interviewReports;
    };

    const getResumePdf = async (interviewReportId) => {
        setGenerating(true);
        try {
            const blob = await generateResumePdf({ interviewReportId }); // ← fixed typo

            // create a download link and trigger it automatically
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `resume_${interviewReportId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error("Error generating resume pdf:", err);
        } finally {
            setGenerating(false);
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }

    }, [interviewId]);

    return { loading, setLoading, generating, fetching, report, setReport, reports, setReports, generateReport, getReportById, getReports, getResumePdf };
}