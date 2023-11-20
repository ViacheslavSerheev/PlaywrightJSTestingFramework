import dotenv from "dotenv";
import { defineConfig, devices } from "@playwright/test";
import { LogLevel } from "@slack/web-api";
import generateCustomLayoutAsync from "./slack";

// Load environment variables from the appropriate .env file
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const selectedProjects = (process.env.PLAYWRIGHT_RUNNER_PROJECTS || "").split(",").map((s) => s.trim());

const fullProjects = {
    chromium: { ...devices["Desktop Chrome"] },
    firefox: { ...devices["Desktop Firefox"] },
    webkit: { ...devices["Desktop Safari"] },
    "Mobile Chrome Android": { ...devices["Pixel 5"] },
    "Mobile Safari IOS": { ...devices["iPhone 12"] },
};
const projects = selectedProjects
    .map((project) =>
        fullProjects[project]
            ? {
                name: project,
                use: fullProjects[project],
            }
            : null
    )
    .filter((obj) => !!obj);

export default defineConfig({
    timeout: +process.env.TEST_TIMEOUT,
    // Directory with the test files
    testDir: "../src/tests",

    // Run all tests in parallel
    fullyParallel: true,

    // Fail the build on CI if you accidentally left test.only in the source code
    forbidOnly: !!process.env.CI,

    // Retry
    retries: +process.env.RETRIES || 0,

    // Opt out of parallel tests
    workers: +process.env.WORKERS,

    // Base URL for tests
    use: {
        baseURL: process.env.BASE_URL,
        httpCredentials: {
            username: process.env.DEV_USERNAME,
            password: process.env.DEV_PASSWORD,
        },
        trace: "on-first-retry",
        navigationTimeout: +process.env.NAVIGATION_TIMEOUT,
        headless: false,
    },

    // Dynamic projects based on .env
    projects,

    // Slack Reporter
    reporter: [
    	[
    		"playwright-slack-report/dist/src/SlackReporter.js",
    		{
    			channels: ["autotests-results-dev"],
    			sendResults: "always",
    			layoutAsync: generateCustomLayoutAsync,
    			maxNumberOfFailuresToShow: 500,
    			meta: [
    				{
    					key: "GITHUB_REF",
    					value: process.env.GITHUB_REF,
    				},
    				{
    					key: "Build Number",
    					value: process.env.GITHUB_RUN_NUMBER,
    				},
    			],
    			slackOAuthToken: process.env.SLACK_BOT_USER_OAUTH_TOKEN,
    			slackLogLevel: LogLevel.DEBUG,
    			disableUnfurl: true,
    			showInThread: true,
    		},
    	],
    ],
});