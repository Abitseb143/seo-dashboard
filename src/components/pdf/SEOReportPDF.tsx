import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#F1F5F9',
        paddingBottom: 15,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    subtitle: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 6,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 20,
        marginTop: 10,
    },
    issueCard: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    issueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    issueTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
        flex: 1,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 9,
        fontWeight: 'bold',
    },
    severityHigh: {
        backgroundColor: '#FEE2E2',
        color: '#B91C1C',
    },
    severityMedium: {
        backgroundColor: '#FEF3C7',
        color: '#92400E',
    },
    severityLow: {
        backgroundColor: '#D1FAE5',
        color: '#065F46',
    },
    metaRow: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 10,
    },
    metaItem: {
        fontSize: 10,
        color: '#64748B',
    },
    fixTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#0F172A',
        marginTop: 10,
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    fixContent: {
        fontSize: 10,
        color: '#475569',
        lineHeight: 1.5,
    },
    impactRow: {
        marginTop: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    impactText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 9,
        color: '#94A3B8',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 15,
    }
});

interface SEOReportPDFProps {
    issues: any[];
    projectName: string;
}

export const SEOReportPDF = ({ issues = [], projectName = "Project" }: SEOReportPDFProps) => {
    const safeIssues = Array.isArray(issues) ? issues : [];
    
    return (
        <Document title={`SEO Report - ${projectName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>SEO Audit Report</Text>
                    <Text style={styles.subtitle}>{projectName} • {new Date().toLocaleDateString()}</Text>
                </View>

                <Text style={styles.sectionTitle}>Prioritized SEO Fixes</Text>

                {safeIssues.length > 0 ? (
                    safeIssues.map((issue, index) => {
                        const sev = (issue.severity || 'low').toLowerCase();
                        const sevStyle = sev === 'high' || sev === 'critical' ? styles.severityHigh : 
                                       sev === 'medium' ? styles.severityMedium : styles.severityLow;

                        return (
                            <View key={index} style={styles.issueCard} wrap={false}>
                                <View style={styles.issueHeader}>
                                    <Text style={styles.issueTitle}>{issue.issueTitle || 'Untitled Issue'}</Text>
                                    <View style={[styles.badge, sevStyle]}>
                                        <Text>{(issue.severity || 'LOW').toUpperCase()}</Text>
                                    </View>
                                </View>

                                <View style={styles.metaRow}>
                                    <Text style={styles.metaItem}>Category: {issue.category || 'General'}</Text>
                                    {issue.pageUrl && <Text style={styles.metaItem}>URL: {issue.pageUrl}</Text>}
                                </View>
                                
                                <Text style={styles.fixTitle}>Recommended Action</Text>
                                <Text style={styles.fixContent}>
                                    {issue.recommendedFix?.recommendedAction || 'Detailed fix instructions are available in the dashboard.'}
                                </Text>
                                
                                <View style={styles.impactRow}>
                                    <Text style={styles.impactText}>
                                        SEO Impact: {issue.recommendedFix?.expectedSEOImpact ? `${issue.recommendedFix.expectedSEOImpact}/10` : 'Significant'}
                                        {' • '}
                                        Effort: {issue.recommendedFix?.estimatedEffort || 'Moderate'}
                                    </Text>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <Text style={styles.fixContent}>No issues found in this audit. Your SEO remains healthy!</Text>
                )}

                <Text style={styles.footer} fixed>
                    Generated by SEO Fixer AI • Empowering your web presence.
                </Text>
            </Page>
        </Document>
    );
};
