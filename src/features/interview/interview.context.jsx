import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false); // ← add
    const [fetching, setFetching] = useState(true);      // ← add
    const [report, setReport] = useState(null);
    const [reports, setReports] = useState([]);

    return (
        <InterviewContext.Provider value={{ loading, setLoading, generating, setGenerating, fetching, setFetching, report, setReport, reports, setReports }}>
            {children}
        </InterviewContext.Provider>
    );
}