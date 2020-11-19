import * as vscode from 'vscode';

const outputChannel = vscode.window.createOutputChannel(`LaTeX.js`);

export const output = (msg: string) => {
    outputChannel.appendLine(msg);
};
