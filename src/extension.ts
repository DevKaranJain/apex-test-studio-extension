// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Uri, Webview } from "vscode";
import {getApexClassNames} from "./cli/commandExecuter";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "apex-test-studio" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('apex-test-studio.apex-test-studio', () => {
		console.log('line 19');
		
		
      try {
		console.log('line 23');
		
        const result =  getApexClassNames(
          "SELECT Id, Name FROM ApexClass LIMIT 5" , "trailhead"
        );
		console.log('result -- ', result)

       // vscode.window.showInformationMessage();
      } catch (err: any) {
        vscode.window.showErrorMessage(err.message);
      
    }

	vscode.window.showInformationMessage('Hello Karan from Apex Test Studio!');
	});

	context.subscriptions.push(disposable);
}

/* export function getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {
  return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
} */
// This method is called when your extension is deactivated
export function deactivate() {}
