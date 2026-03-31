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
export async function fetchPageWithPlaywright(url: string, timeout = 30000): Promise<PlaywrightFetchResult | any> {
  console.warn("Playwright fetcher is disabled in this environment. Falling back to raw HTML.");
  return {
    url,
    html: "",
    headers: {},
    statusCode: 0,
    responseTime: 0,
    cwv: {}
  };
}
export async function measureCoreWebVitals(url: string, timeout = 30000): Promise<CoreWebVitals> {
  return {};
}
export function getBrowser() { return null; }
