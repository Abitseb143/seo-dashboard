"use client";

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { SEOReportPDF } from '../pdf/SEOReportPDF';

interface DownloadPDFButtonProps {
    issues: any[];
    projectName?: string;
}

export const DownloadPDFButton = ({ issues, projectName = "Project" }: DownloadPDFButtonProps) => {
    return (
        <PDFDownloadLink
            document={<SEOReportPDF issues={issues} projectName={projectName} />}
            fileName={`seo-report-${projectName.toLowerCase().replace(/\s+/g, '-')}.pdf`}
        >
            {({ blob, url, loading, error }) => (
                <button
                    disabled={loading || issues.length === 0}
                    className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200`}
                >
                    {loading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Preparing PDF...</span>
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
