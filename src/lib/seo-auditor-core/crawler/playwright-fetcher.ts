// Mocked Playwright Fetcher since Next.js cannot bundle it
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

export async function initBrowser() { }
export async function closeBrowser() { }
export async function fetchPageWithPlaywright(url: string, timeout = 30000): Promise<PlaywrightFetchResult> {
  throw new Error("Playwright fetcher is disabled in this environment.");
}
export async function measureCoreWebVitals(url: string, timeout = 30000): Promise<CoreWebVitals> {
  return {};
}
export function getBrowser() { return null; }
