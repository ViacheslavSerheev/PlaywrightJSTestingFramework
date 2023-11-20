class BasePage {
    constructor(page) {
        this.page = page;
    }

    async getAllImageAlts() {
        const imageTags = await this.page.locator("img").all();
        return await Promise.allSettled(imageTags.map(async (it) => it.getAttribute("alt")));
    }
}

export default BasePage;