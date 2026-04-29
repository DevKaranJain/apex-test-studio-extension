import * as vscode from 'vscode';
import { getDefaultOrg, getAllOrgs } from "./cli/getOrgInfo";

export async function activate(context: vscode.ExtensionContext) {	
	const disposable = vscode.commands.registerCommand('apex-test-studio.apex-test-studio', async () => { // <-- add async here
		try {
			const orgIdentifier = await getDefaultOrg();
			console.log('Connected Org:', orgIdentifier);
			vscode.window.showInformationMessage(`Connected to Salesforce Org: ${orgIdentifier}`);

		} catch (error) {
			vscode.window.showErrorMessage(`Failed to connect to Salesforce Org: ${error}`);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}