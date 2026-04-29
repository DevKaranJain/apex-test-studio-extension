"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrgInfo = getOrgInfo;
const child_process_1 = require("child_process");
function getOrgInfo(alias) {
    return new Promise((resolve, reject) => {
        const GET_ORG_INFO = alias
            ? 'sf org display --target-org ${alias} --json'
            : 'sf org display --json';
        console.log('alias -- ', GET_ORG_INFO);
        (0, child_process_1.exec)(GET_ORG_INFO, (error, stderr, stdout) => {
            if (error) {
                console.log('Error in if ', JSON.stringify(error));
                reject(new Error(stderr || error.message));
                return;
            }
            try {
                const parsedJSON = JSON.parse(stdout);
                console.log('successfully get the org Data ', parsedJSON);
                resolve(parsedJSON.result);
            }
            catch (error) {
                reject(new Error('failed to parse the org info'));
            }
        });
    });
}
//# sourceMappingURL=getOrgInfo.js.map