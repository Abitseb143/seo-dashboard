import { chromium, type Browser, type Page } from 'playwright';
import * as cheerio from 'cheerio';
import { CoreWebVitals } from '../types';

export interface PlaywrightFetchResult {
  url: string;
  html: string;
  $: any;
  headers: Record<string, string>;
  statusCode: number;
  responseTime: number;
  cwv: CoreWebVitals;
}

let browser: Browser | null = null;

export async function initBrowser() {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

export function getBrowser() { return browser; }

export async function fetchPageWithPlaywright(url: string, timeout = 30000): Promise<PlaywrightFetchResult> {
  const browser = await initBrowser();
  const context = await browser.newContext({
    userAgent: 'SEOmatorBot/2.0 (+https://github.com/seo-skills/seo-audit-skill)',
  });
  const page = await context.newPage();
  const startTime = performance.now();

  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout });
    if (!response) throw new Error('No response from Playwright');

    const responseTime = performance.now() - startTime;
    const html = await page.content();
    const $ = cheerio.load(html);

    // Capture CWV metrics from the page
    const cwv = await page.evaluate(async () => {
      return new Promise((resolve) => {
        let metrics: any = {};
        
        // Use PerformanceObserver for LCP, FCP, CLS
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = entry.startTime;
            }
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              metrics.cls = (metrics.cls || 0) + (entry as any).value;
            }
          }
        });

        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        observer.observe({ type: 'paint', buffered: true });
        observer.observe({ type: 'layout-shift', buffered: true });

        // Wait a bit for metrics to stabilize
        setTimeout(() => {
          observer.disconnect();
          resolve(metrics);
        }, 1000);
      });
    }) as CoreWebVitals;

    // Add TTFB from performance timing
    const timing = await page.evaluate(() => {
        const [nav] = performance.getEntriesByType('navigation') as any[];
        return nav ? nav.responseStart - nav.requestStart : 0;
    });
    cwv.ttfb = timing;

    return {
      url,
      html,
      $,
      headers: await response.headers(),
      statusCode: response.status(),
      responseTime: Math.round(responseTime),
      cwv
    };
  } finally {
    await page.close();
    await context.close();
  }
}

export async function measureCoreWebVitals(url: string, timeout = 30000): Promise<CoreWebVitals> {
  const res = await fetchPageWithPlaywright(url, timeout);
  return res.cwv;
}
