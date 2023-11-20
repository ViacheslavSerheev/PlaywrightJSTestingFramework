import { test, test as base, chromium, expect } from "@playwright/test";
import { desktopConfig, defaultConfig } from "lighthouse";
import { playAudit } from "playwright-lighthouse";
import { pagespeedonline } from "@googleapis/pagespeedonline";
import getPort from "get-port";
import { loadDataFile } from "../../helpers/loadDataFile";

const pagespeed = pagespeedonline("v5");

const lighthouseTest = base.extend({
    port: [
        async ({}, use) => {
            const port = await getPort();
            await use(port);
        },
        { scope: "worker" }, // Ensure this is 'worker'
    ],

    browser: [
        async ({ port }, use) => {
            const browser = await chromium.launch({
                args: [`--remote-debugging-port=${port}`],
            });
            await use(browser);
        },
        { scope: "worker" },
    ],
});

const testPages = [
    { pageName: "pt/bitcoin-faucet", pageDataFile: "bitcoinFaucet.pt.page.json" },
    { pageName: "cn/bitcoin-faucet", pageDataFile: "bitcoinFaucet.cn.page.json" },
    { pageName: "es/bitcoin-faucet", pageDataFile: "bitcoinFaucet.es.page.json" },
];

for (const { pageName, pageDataFile } of testPages) {
    lighthouseTest.describe(`LIGHTHOUSE: Performance Validation for page [${pageName}]`, () => {
        let pageData = null;

        lighthouseTest.beforeEach(async ({ page }) => {
            // Setup/Navigate
            pageData = await loadDataFile(pageDataFile);
            await page.goto(pageData.url);
        });

        lighthouseTest(`[${pageName}] Validate Lighthouse Performance on desktop`, async ({ page, port }) => {
            // Desktop Lighthouse Audit
            await playAudit({
                page,
                port,
                config: desktopConfig,
                disableLogs: true,
                thresholds: {
                    performance: pageData.pagespeed.lighthouse.desktop,
                },
            });
        });

        lighthouseTest(`[${pageName}] Validate Lighthouse Performance on mobile`, async ({ page, port }) => {
            // Mobile Lighthouse Audit
            await playAudit({
                page,
                port,
                config: defaultConfig,
                disableLogs: true,
                thresholds: {
                    performance: pageData.pagespeed.lighthouse.mobile,
                },
            });
        });
    });
    test.describe(`PAGESPEED_INSIGHTS: Performance Validation for page [${pageName}]`, () => {
        let pageData = null;

        test.beforeEach(async () => {
            // Setup
            pageData = await loadDataFile(pageDataFile); // Assuming you have a function to load data
        });

        test(`[${pageName}] Validate PageSpeed Insights Desktop`, async () => {
            const res = await pagespeed.pagespeedapi.runpagespeed({
                url: `${process.env.BASE_URL}${pageData.url}`,
                strategy: "DESKTOP",
            });
            const score = res.data.lighthouseResult.categories.performance.score * 100;
            expect(score).toBeGreaterThanOrEqual(pageData.pagespeed.pageSpeedInsights.desktop);
        });
        test(`[${pageName}] Validate PageSpeed Insights Mobile`, async () => {
            const res = await pagespeed.pagespeedapi.runpagespeed({
                url: `${process.env.BASE_URL}${pageData.url}`,
                strategy: "MOBILE",
            });
            const score = res.data.lighthouseResult.categories.performance.score * 100;
            expect(score).toBeGreaterThanOrEqual(pageData.pagespeed.pageSpeedInsights.mobile);
        });
    });
}