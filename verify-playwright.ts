import { fetchPageWithPlaywright, closeBrowser } from './src/lib/seo-auditor-core/crawler/playwright-fetcher';

async function test() {
    const url = 'https://www.google.com';
    console.log(`Testing Playwright measurement for: ${url}`);
    
    try {
        const result = await fetchPageWithPlaywright(url);
        console.log('--- Results ---');
        console.log('Status:', result.statusCode);
        console.log('CWV:', JSON.stringify(result.cwv, null, 2));
        console.log('HTML Length:', result.html.length);
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await closeBrowser();
    }
}

test();
