import type { CoreWebVitals } from '../types';

/**
 * Fetches Core Web Vitals metrics from Google PageSpeed Insights API
 * @param url The URL to analyze
 * @param apiKey Optional API key
 */
export async function fetchCwvFromPsi(url: string, apiKey?: string): Promise<CoreWebVitals> {
    const psiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    psiUrl.searchParams.set('url', url);
    psiUrl.searchParams.set('category', 'performance');
    if (apiKey) {
        psiUrl.searchParams.set('key', apiKey);
    }

    try {
        const response = await fetch(psiUrl.toString());
        if (!response.ok) {
            throw new Error(`PSI API failed: ${response.statusText}`);
        }

        const data = await response.json();
        const loadingExperience = data.loadingExperience?.metrics;
        const lighthouse = data.lighthouseResult?.audits;

        return {
            lcp: lighthouse?.['largest-contentful-paint']?.numericValue,
            fcp: lighthouse?.['first-contentful-paint']?.numericValue,
            cls: lighthouse?.['cumulative-layout-shift']?.numericValue,
            ttfb: lighthouse?.['server-response-time']?.numericValue,
            inp: loadingExperience?.['INTERACTION_TO_NEXT_PAINT']?.percentile,
        };
    } catch (error) {
        console.error('[PSI] Failed to fetch metrics:', error);
        return {};
    }
}
