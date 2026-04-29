"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrgs = getAllOrgs;
exports.getDefaultOrg = getDefaultOrg;
/// <reference types="node" />
const imports_1 = require("../common/imports");
const core_1 = require("@salesforce/core");
async function getAllOrgs() {
    const stateAggregator = await core_1.StateAggregator.getInstance();
    const aliases = stateAggregator.aliases.getAll();
    console.log('alias =>', aliases);
    const orgs = await core_1.AuthInfo.listAllAuthorizations();
    return orgs.map(org => ({
        userName: org.username ?? '',
        instanceUrl: org.instanceUrl ?? '',
        accessToken: org.accessToken ?? '',
        orgId: org.orgId ?? '',
        alias: aliases[org.username] ?? org.username,
    }));
}
async function pickAndSetDefaultOrg() {
    const orgs = await core_1.AuthInfo.listAllAuthorizations();
    if (orgs.length === 0) {
        imports_1.vscode.window.showWarningMessage('No connected Salesforce orgs found.');
        return undefined;
    }
    const items = orgs.map(org => ({
        label: org.username ?? org.username,
        description: org.instanceUrl ?? '',
        detail: org.isScratchOrg ? '$(star) Scratch Org' : '$(globe) Production/Sandbox',
        username: org.username,
    }));
    const selected = await imports_1.vscode.window.showQuickPick(items, {
        placeHolder: 'No default org set — please select an org to use',
        matchOnDescription: true,
        matchOnDetail: true,
    });
    if (!selected) {
        return undefined;
    }
    try {
        // Set at project-level first, fallback to global if no project config found
        const config = await core_1.Config.create({ isGlobal: false });
        config.set(core_1.OrgConfigProperties.TARGET_ORG, selected.username);
        await config.write();
    }
    catch {
        // If project-level fails (no sfdx-project.json), set globally
        const config = await core_1.Config.create({ isGlobal: true });
        config.set(core_1.OrgConfigProperties.TARGET_ORG, selected.username);
        await config.write();
    }
    imports_1.vscode.window.showInformationMessage(`✅ Default org set to: ${selected.label}`);
    return selected.username;
}
async function getDefaultOrg() {
    try {
        const aggregator = await core_1.ConfigAggregator.create();
        const defaultOrg = aggregator.getPropertyValue(core_1.OrgConfigProperties.TARGET_ORG);
        if (!defaultOrg) {
            return await pickAndSetDefaultOrg();
        }
        return defaultOrg;
    }
    catch (error) {
        imports_1.vscode.window.showErrorMessage(`Error fetching org: ${error}`);
        return undefined;
    }
}
//# sourceMappingURL=getOrgInfo.js.map