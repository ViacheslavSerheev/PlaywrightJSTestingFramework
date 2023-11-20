class Head {
    constructor(page) {
        this.page = page;
    }

    static generateAttributeSelector = (obj) =>
        Object.keys(obj)
            .map((attribute) => `[${attribute}="${obj[attribute]}"]`)
            .join("");

    static getAttributes = async (elementHandle) =>
        elementHandle.evaluate((element) => {
            const attributeNodeArray = [...element.attributes];
            return attributeNodeArray.reduce((attr, attribute) => {
                attr[attribute.name] = attribute.value;
                return attr;
            }, {});
        });

    async getTitle() {
        return await this.page.title();
    }

    async getLinkBySelector(link) {
        try {
            const linkHandle = await this.page.$(`link${this.constructor.generateAttributeSelector(link)}`);
            if (!linkHandle) return null;
            return await this.constructor.getAttributes(linkHandle);
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async getMetaBySelector(meta) {
        try {
            const metaHandle = await this.page.$(`meta${this.constructor.generateAttributeSelector(meta)}`);
            if (!metaHandle) return null;
            return await this.constructor.getAttributes(metaHandle);
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}

export default Head;