import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

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
        marginBottom: 30,
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    issueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 10,
    },
    issueTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
        flex: 1,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        fontSize: 9,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    severityCritical: {
        backgroundColor: '#FFF1F2',
        color: '#E11D48',
        borderWidth: 1,
        borderColor: '#FECDD3',
    },
    severityHigh: {
        backgroundColor: '#FFFBEB',
        color: '#B45309',
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    severityMedium: {
        backgroundColor: '#EFF6FF',
        color: '#1D4ED8',
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    problemSummary: {
        fontSize: 11,
        color: '#475569',
        marginBottom: 15,
        lineHeight: 1.4,
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    codeBox: {
        padding: 12,
        borderRadius: 8,
        fontFamily: 'Courier',
        fontSize: 9,
        marginBottom: 15,
    },
    currentCodeBox: {
        backgroundColor: '#FEF2F2',
        color: '#991B1B',
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    replacementCodeBox: {
        backgroundColor: '#ECFDF5',
        color: '#065F46',
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    whyItMattersBox: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        marginTop: 5,
    },
    whyItMattersText: {
        fontSize: 9,
        color: '#1E40AF',
        lineHeight: 1.4,
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
    },
    urlText: {
        fontSize: 9,
        color: '#64748B',
        fontFamily: 'Courier',
        marginBottom: 10,
    }
});

interface SEOReportPDFProps {
    issues: any[];
    projectName: string;
}

export const SEOReportPDF = ({ issues = [], projectName = "Project" }: SEOReportPDFProps) => {
    const safeIssues = Array.isArray(issues) ? issues : [];
    
    return (
        <Document title={`Full SEO Report - ${projectName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>SEO Audit Report</Text>
                    <Text style={styles.subtitle}>{projectName} • Detailed Recommendations • {new Date().toLocaleDateString()}</Text>
                </View>

                <Text style={styles.sectionTitle}>Prioritized SEO Fixes</Text>

                {safeIssues.map((issue, index) => {
                    const sev = (issue.severity || 'low').toLowerCase();
                    const sevStyle = sev === 'critical' ? styles.severityCritical : 
                                   sev === 'high' ? styles.severityHigh : styles.severityMedium;
                    const fix = issue.recommendedFix;

                    return (
                        <View key={index} style={styles.issueCard} wrap={false}>
                            <View style={styles.issueHeader}>
                                <Text style={styles.issueTitle}>{issue.issueTitle}</Text>
                                <View style={[styles.badge, sevStyle]}>
                                    <Text>{sev.toUpperCase()} PRIORITY</Text>
                                </View>
                            </View>

                            {issue.pageUrl && <Text style={styles.urlText}>URL: {issue.pageUrl}</Text>}
                            
                            <Text style={styles.problemSummary}>{issue.problemSummary}</Text>

                            {issue.currentState && (
                                <View>
                                    <Text style={styles.label}>- Where the problem is:</Text>
                                    <View style={[styles.codeBox, styles.currentCodeBox]}>
                                        <Text>{issue.currentState}</Text>
                                    </View>
                                </View>
                            )}

                            <View>
                                <Text style={styles.label}>- Recommended Action:</Text>
                                <Text style={styles.problemSummary}>{fix?.recommendedAction}</Text>
                            </View>

                            {fix?.bestFixOption && (
                                <View>
                                    <Text style={styles.label}>- Replace with this code:</Text>
                                    <View style={[styles.codeBox, styles.replacementCodeBox]}>
                                        <Text>{fix.bestFixOption}</Text>
                                    </View>
                                </View>
                            )}

                            {issue.whyItMatters && (
                                <View style={styles.whyItMattersBox}>
                                    <Text style={[styles.label, { color: '#1E40AF', marginBottom: 4 }]}>- Why this matters:</Text>
                                    <Text style={styles.whyItMattersText}>{issue.whyItMatters}</Text>
                                </View>
                            )}
                        </View>
                    );
                })}

                <Text style={styles.footer} fixed>
                    Generated by SEO Fixer AI • Fully Tailored SEO Solutions.
                </Text>
            </Page>
        </Document>
    );
};
