import { test, expect } from "@playwright/test";
import BasePage from "../../pages/components/BasePage";
import { loadDataFile } from "../../helpers/loadDataFile";

const testPages = [
    { pageName: "pt/bitcoin-faucet", pageDataFile: "bitcoinFaucet.pt.page.json" },
    { pageName: "cn/bitcoin-faucet", pageDataFile: "bitcoinFaucet.cn.page.json" },
    { pageName: "es/bitcoin-faucet", pageDataFile: "bitcoinFaucet.es.page.json" },
];

for (const { pageName, pageDataFile } of testPages) {
    test.describe(`Checking redirects for page [${pageName}]`, () => {
        let pageData = null;
        let base = null;

        test.beforeEach(async ({ page }) => {
            base = new BasePage(page);
            pageData = await loadDataFile(pageDataFile);
        });

        test(`Checking that page: ${pageName} has correct redirect`, async ({ page}) => {
            await page.goto(process.env.BASE_URL.replace('https://', 'http://') + pageData.url)

            const res = await page.waitForNavigation()
            console.log(res)

            const response = await page.waitForResponse(response => {
                console.log(response.url())
                console.log(response.status())
                return response.url() === process.env.BASE_URL.replace('https://', 'http://') + pageData.url && response.status() >= 300 && response.status() < 400
            })

            expect(response.status()).to.equal(301)
        });
    });
}