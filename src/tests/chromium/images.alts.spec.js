import { test, expect } from "@playwright/test";
import BasePage from "../../pages/components/BasePage";
import { loadDataFile } from "../../helpers/loadDataFile";

const testPages = [
    { pageName: "pt/bitcoin-faucet", pageDataFile: "bitcoinFaucet.pt.page.json" },
    { pageName: "cn/bitcoin-faucet", pageDataFile: "bitcoinFaucet.cn.page.json" },
    { pageName: "es/bitcoin-faucet", pageDataFile: "bitcoinFaucet.es.page.json" },
];

for (const { pageName, pageDataFile } of testPages) {
    test.describe(`Checking all alt attributes for img tags for page [${pageName}]`, () => {
        let pageData = null;
        let base = null;

        test.beforeEach(async ({ page }) => {
            base = new BasePage(page);
            pageData = await loadDataFile(pageDataFile);
            await page.goto(pageData.url);
        });

        test(`Checking that page: ${pageName} has proper alt attributes`, async () => {
            const imageAlts = await base.getAllImageAlts(pageData.url);
            expect(imageAlts.map((it) => it.value)).not.toContain("");
        });
    });
}