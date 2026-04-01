import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

type RecommendedFixData = {
  recommendedAction: string;
  bestFixOption: string;
  alternativeFixOptions: string | null;
  expectedSEOImpact: number;
  implementationDifficulty: number;
  estimatedEffort: string;
  codeExample: string | null;
  cmsInstruction: string | null;
  priorityRank: number;
  confidenceLevel: number;
  status: string;
};

export type DashboardIssue = {
  id: string;
  category: string;
  severity: string;
  issueTitle: string;
  problemSummary: string;
  whyItMatters: string;
  currentState: string;
  pageUrl: string | null;
  recommendedFix: RecommendedFixData | null;
};

export type LatestAuditData = {
  auditId: string;
  overallScore: number;
  project: {
    id: string;
    name: string | null;
    url: string;
  };
  stats: {
    totalIssues: number;
    criticalIssues: number;
    highIssues: number;
  };
  bestFixes: DashboardIssue[];
  quickWins: DashboardIssue[];
  technicalFixes: DashboardIssue[];
  contentFixes: DashboardIssue[];
  allIssues: DashboardIssue[];
};

export type AuditHistoryEntry = {
  id: string;
  projectName: string;
  date: string;
  score: number;
  issues: number;
  status: string;
};

export type TrendPoint = {
  name: string;
  score: number;
};

function normalizeCategory(category: string): string {
  return category.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function isTechnicalCategory(category: string): boolean {
  const normalized = normalizeCategory(category);
  return ["technical", "performance", "perf", "security", "redirect", "url", "crawl"].includes(normalized);
}

function isContentCategory(category: string): boolean {
  const normalized = normalizeCategory(category);
  return ["content", "on-page-seo", "on-page", "core", "schema", "links", "images"].includes(normalized);
}

function flattenIssues(
  pageAudits: Array<{
    url: string;
    issues: Array<{
      id: string;
      category: string;
      severity: string;
      issueTitle: string;
      problemSummary: string;
      whyItMatters: string;
      currentState: string;
      pageUrl: string | null;
      recommendedFix: RecommendedFixData | null;
    }>;
  }>
): DashboardIssue[] {
  return pageAudits.flatMap((pageAudit) =>
    pageAudit.issues.map((issue) => ({
      ...issue,
      pageUrl: issue.pageUrl ?? pageAudit.url,
    }))
  );
}

function sortIssuesByPriority(issues: DashboardIssue[]): DashboardIssue[] {
  return [...issues].sort((a, b) => {
    const aRank = a.recommendedFix?.priorityRank ?? 0;
    const bRank = b.recommendedFix?.priorityRank ?? 0;
    return bRank - aRank;
  });
}

function logAuditDataError(scope: string, error: unknown): void {
  console.error(`[audit-data] ${scope} failed`, error);
}

export async function getLatestAuditData(): Promise<LatestAuditData | null> {
  noStore();

  let latestAudit;
  try {
    latestAudit = await prisma.audit.findFirst({
      where: { status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      include: {
        project: true,
        pageAudits: {
          include: {
            issues: {
              include: {
                recommendedFix: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    logAuditDataError("getLatestAuditData", error);
    return null;
  }

  if (!latestAudit) {
    return null;
  }

  const allIssues = sortIssuesByPriority(flattenIssues(latestAudit.pageAudits));
  const quickWins = allIssues.filter(
    (issue) => (issue.recommendedFix?.implementationDifficulty ?? 10) <= 3
  );
  const technicalFixes = allIssues.filter((issue) => isTechnicalCategory(issue.category));
  const contentFixes = allIssues.filter((issue) => isContentCategory(issue.category));

  return {
    auditId: latestAudit.id,
    overallScore: latestAudit.overallScore,
    project: {
      id: latestAudit.project.id,
      name: latestAudit.project.name,
      url: latestAudit.project.url,
    },
    stats: {
      totalIssues: allIssues.length,
      criticalIssues: allIssues.filter((issue) => issue.severity === "critical").length,
      highIssues: allIssues.filter((issue) => issue.severity === "high").length,
    },
    bestFixes: allIssues,
    quickWins,
    technicalFixes,
    contentFixes,
    allIssues,
  };
}

export async function getAuditHistory(): Promise<AuditHistoryEntry[]> {
  noStore();

  let audits;
  try {
    audits = await prisma.audit.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        project: true,
        pageAudits: {
          include: {
            issues: true,
          },
        },
      },
    });
  } catch (error) {
    logAuditDataError("getAuditHistory", error);
    return [];
  }

  return audits.map((audit) => {
    const totalIssues = audit.pageAudits.reduce((sum, pageAudit) => sum + pageAudit.issues.length, 0);

    return {
      id: audit.id,
      projectName: audit.project?.name || audit.project?.url || "Unknown",
      date: audit.createdAt.toISOString(),
      score: Math.round(audit.overallScore),
      issues: totalIssues,
      status: audit.status,
    };
  });
}

export async function getScoreTrend(limit = 5): Promise<TrendPoint[]> {
  noStore();

  let audits;
  try {
    audits = await prisma.audit.findMany({
      where: { status: "COMPLETED" },
      orderBy: { createdAt: "asc" },
      take: limit,
      select: {
        createdAt: true,
        overallScore: true,
      },
    });
  } catch (error) {
    logAuditDataError("getScoreTrend", error);
    return [];
  }

  return audits.map((audit) => ({
    name: audit.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: Math.round(audit.overallScore),
  }));
}

export async function getLatestProjectLabel(): Promise<string> {
  noStore();

  let latestAudit;
  try {
    latestAudit = await prisma.audit.findFirst({
      where: { status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      include: { project: true },
    });
  } catch (error) {
    logAuditDataError("getLatestProjectLabel", error);
    return "SEO Project";
  }

  return latestAudit?.project.name || latestAudit?.project.url || "SEO Project";
}
