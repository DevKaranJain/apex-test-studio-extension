"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrgInfo = getOrgInfo;
exports.getApexClassNames = getApexClassNames;
exports.run = run;
const child_process_1 = require("child_process");
function getOrgInfo(alias) {
    alias = 'trailhead';
    return new Promise((resolve, reject) => {
        const GET_ORG_INFO = alias
            ? `sf org display --target-org ${alias} --json`
            : `sf org display --json`;
        console.log('alias -- ', GET_ORG_INFO);
        (0, child_process_1.exec)(GET_ORG_INFO, (error, stderr, stdout) => {
            console.log('=== STDOUT ===', JSON.stringify(stdout));
            console.log('=== STDERR ===', JSON.stringify(stderr));
            console.log('=== ERROR ===', JSON.stringify(error));
            if (error) {
                console.log('Error in if ', JSON.stringify(error));
                reject(new Error(stderr || error.message));
                return;
            }
            try {
                // Extract only the JSON part from stdout
                const jsonMatch = stderr.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    reject(new Error('No JSON found in output'));
                    return;
                }
                const parsedJSON = JSON.parse(jsonMatch[0]);
                console.log('Org data: ', parsedJSON);
                resolve({
                    accessToken: parsedJSON.result.accessToken,
                    userName: parsedJSON.result.username,
                    instanceUrl: parsedJSON.result.instanceUrl,
                    orgId: parsedJSON.result.id,
                    alias: parsedJSON.result.alias,
                });
            }
            catch (error) {
                reject(new Error('failed to parse the org info'));
            }
        });
    });
}
/* export async function getApexClassNames(query : string, alias?:string){
    const orgInfo = await getOrgInfo();
    
    const url = `${orgInfo.instanceUrl}/services/data/v60.0/tooling/query?q=${encodeURIComponent(query)}`;
    const response = await fetch(url,{
        method : "GET",
        headers:{
           "Authorization": `Bearer ${orgInfo.accessToken}`,
            "Content-Type" : "application/json"
        }
    });

    if(!response.ok){
        throw new Error(`tooling Api Failed ${response.status} ${response.statusText}`);
    }
} */
async function getApexClassNames(query, alias) {
    const orgInfo = await getOrgInfo(alias);
    const url = `${orgInfo.instanceUrl}/services/data/v60.0/tooling/query?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${orgInfo.accessToken.trim()}`,
            "Content-Type": "application/json",
        },
    });
    // Read body ONLY once
    const text = await response.text();
    if (!response.ok) {
        throw new Error(`Tooling API Failed ${response.status}: ${text}`);
    }
    const data = JSON.parse(text);
    return data; // contains records[]
}
async function run() {
    try {
        console.log('run methdo called ');
        const result = await (getApexClassNames("Select Id, Name from apexClass LIMIT 5"));
        console.log('Result => ', result);
    }
    catch (Error) {
        console.log('get error in run method ');
    }
}
//# sourceMappingURL=commandExecuter.js.map