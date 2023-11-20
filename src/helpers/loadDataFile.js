import fs from "fs-extra";

const loadDataFile = async (pageDataFile) => {
    const file = await fs.readJson(`./src/fixtures/${pageDataFile}`);
    const stringifiedJSON = JSON.stringify(file).replace(/{BASE_URL}/g, process.env.BASE_URL);
    return JSON.parse(stringifiedJSON);
};

const loadDataFileLocalization = async (pageDataFile) => {
    const file = await fs.readJson(`./src/fixtures/localization/${pageDataFile}`);
    const stringifiedJSON = JSON.stringify(file).replace(/{BASE_URL}/g, process.env.BASE_URL);
    return JSON.parse(stringifiedJSON);
};

export { loadDataFile, loadDataFileLocalization };