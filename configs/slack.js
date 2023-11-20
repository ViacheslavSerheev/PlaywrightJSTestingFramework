export default async function generateCustomLayoutAsync(summaryResults) {
    const header = {
        type: "header",
        text: {
            type: "plain_text",
            text: "🎭 *Playwright E2E Test Results For nda*",
            emoji: true,
        },
    };

    const summary = {
        type: "section",
        text: {
            type: "mrkdwn",
            text: `✅ *${summaryResults.passed}* | ❌ *${summaryResults.failed}* | ⏩ *${summaryResults.skipped}*`,
        },
    };

    const fails = summaryResults.tests
        .filter((it) => it.status === "failed" || it.status === "timedOut")
        .map((it) => ({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `👎 *[${it.browser}] | ${it.suiteName}*`,
            },
        }));

    return [header, summary, { type: "divider" }, ...fails];
}