import { test, expect } from "@playwright/test";
import Head from "../../pages/components/Head";
import { loadDataFile } from "../../helpers/loadDataFile";

const testPages = [
    { pageName: "pt/bitcoin-faucet", pageDataFile: "bitcoinFaucet.pt.page.json" },
    { pageName: "cn/bitcoin-faucet", pageDataFile: "bitcoinFaucet.cn.page.json" },
    { pageName: "es/bitcoin-faucet", pageDataFile: "bitcoinFaucet.es.page.json" },
];

for (const { pageName, pageDataFile } of testPages) {
    test.describe(`Tags Validation for page [${pageName}]`, () => {
        let pageData = null;
        let head = null;

        test.beforeEach(async ({ page }) => {
            // Setup/Navigate
            pageData = await loadDataFile(pageDataFile);
            head = new Head(page);
            if (pageData.url === "") {
                await page.goto(process.env.BASE_URL)
            } else {
                await page.goto(pageData.url);
            }
        });

        test(`[${pageName}] Validate page title`, async ({ page }) => {
            // Validate Title
            const actualTitle = await head.getTitle();
            expect(actualTitle).toBe(pageData.title);
        });

        test(`[${pageName}] Validate link tags`, async () => {
            // Validate Link Tags
            for (const linkData of pageData.links) {
                const linkAttributes = await head.getLinkBySelector(linkData);
                expect(linkAttributes).toEqual(linkData);
            }
        });

        test(`[${pageName}] Validate meta tags`, async () => {
            // Validate Meta Tags
            for (const metaData of pageData.meta) {
                const metaAttributes = await head.getMetaBySelector(metaData);
                expect(metaAttributes).toEqual(metaData);
            }
        });
    });
}