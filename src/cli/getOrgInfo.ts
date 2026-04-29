/// <reference types="node" />
import { exec, spawn, vscode } from '../common/imports';
import { salesforceOrglist, OrgEntry, salesforceOrgInfo } from '../cli/interface';
import { AuthInfo, StateAggregator, ConfigAggregator, Config, OrgConfigProperties } from '@salesforce/core';


export async function getAllOrgs(): Promise<salesforceOrgInfo[]> {
  const stateAggregator = await StateAggregator.getInstance();
  const aliases = stateAggregator.aliases.getAll();
  console.log('alias =>', aliases);

  const orgs = await AuthInfo.listAllAuthorizations();

  return orgs.map(org => ({
    userName: org.username ?? '',
    instanceUrl: org.instanceUrl ?? '',
    accessToken: org.accessToken ?? '',
    orgId: org.orgId ?? '',
    alias: aliases[org.username] ?? org.username,
  }));
}

async function pickAndSetDefaultOrg(): Promise<string | undefined> {
  const orgs = await AuthInfo.listAllAuthorizations();

  if (orgs.length === 0) {
    vscode.window.showWarningMessage('No connected Salesforce orgs found.');
    return undefined;
  }

  const items = orgs.map(org => ({
    label: org.username ?? org.username,
    description: org.instanceUrl ?? '',
    detail: org.isScratchOrg ? '$(star) Scratch Org' : '$(globe) Production/Sandbox',
    username: org.username,
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'No default org set — please select an org to use',
    matchOnDescription: true,
    matchOnDetail: true,
  });

  if (!selected) {return undefined};

  try {
    // Set at project-level first, fallback to global if no project config found
    const config = await Config.create({ isGlobal: false });
    config.set(OrgConfigProperties.TARGET_ORG, selected.username);
    await config.write();
  } catch {
    // If project-level fails (no sfdx-project.json), set globally
    const config = await Config.create({ isGlobal: true });
    config.set(OrgConfigProperties.TARGET_ORG, selected.username);
    await config.write();
  }

  vscode.window.showInformationMessage(`✅ Default org set to: ${selected.label}`);

  return selected.username;
}

export async function getDefaultOrg(): Promise<string | undefined> {
  try {
    const aggregator = await ConfigAggregator.create();
    const defaultOrg = aggregator.getPropertyValue(OrgConfigProperties.TARGET_ORG);

    if (!defaultOrg) {
      return await pickAndSetDefaultOrg();
    }

    return defaultOrg as string;

  } catch (error) {
    vscode.window.showErrorMessage(`Error fetching org: ${error}`);
    return undefined;
  }
}