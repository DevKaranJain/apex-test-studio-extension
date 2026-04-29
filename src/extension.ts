import * as vscode from 'vscode';
import { Uri, Webview } from "vscode";
//import { getAllOrgs } from 
//import { getOrgInfo } from "./cli/getOrgInfo";
import {getApexClassNames} from "./cli/commandExecuter";
import { getDefaultOrg, getAllOrgs } from "./cli/getOrgInfo";

export async function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "apex-test-studio" is now active!');
	
	const disposable = vscode.commands.registerCommand('apex-test-studio.apex-test-studio', async () => { // <-- add async here
		console.log('In extension file in registered command');
		
		try {
			const orgIdentifier = await getDefaultOrg();
			console.log('Connected Org:', orgIdentifier);
			//const apexClassData = await getApexClassNames(orgIdentifier);
			//console.log('apexClass data ', apexClassData);
			
			
			vscode.window.showInformationMessage(`Connected to Salesforce Org: ${orgIdentifier}`);

		} catch (error) {
			vscode.window.showErrorMessage(`Failed to connect to Salesforce Org: ${error}`);
		}

		vscode.window.showInformationMessage('Hello Karan from Apex Test Studio!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}