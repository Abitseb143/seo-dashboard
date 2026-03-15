"use client";

import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { SEOReportPDF } from '../pdf/SEOReportPDF';

interface DownloadPDFButtonProps {
    issues: any[];
    projectName?: string;
}

const DownloadPDFButton = ({ issues, projectName = "Project" }: DownloadPDFButtonProps) => {
    // We use a state to handle the 'rendering' phase which can sometimes be finicky 
    // with PDFDownloadLink in Next.js.
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <button disabled className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg opacity-50 cursor-not-allowed bg-emerald-500 shadow-sm">
                <Loader2 size={16} className="animate-spin" />
                <span>Initializing...</span>
            </button>
        );
    }

    return (
        <PDFDownloadLink
            document={<SEOReportPDF issues={issues} projectName={projectName} />}
            fileName={`seo-report-${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`}
        >
            {({ blob, url, loading, error }) => (
                <button
                    disabled={loading || !!error || issues.length === 0}
                    title={error ? "Error generating PDF" : issues.length === 0 ? "No data to download" : "Download PDF"}
                    className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                        error ? 'bg-red-500' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                    }`}
                >
                    {loading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Preparing PDF...</span>
                        </>
                    ) : error ? (
                        <>
                            <AlertCircle size={16} />
                            <span>Export Error</span>
                        </>
                    ) : (
                        <>
                            <Download size={16} />
                            <span>Download Report PDF</span>
                        </>
                    )}
                </button>
            )}
        </PDFDownloadLink>
    );
};

export default DownloadPDFButton;