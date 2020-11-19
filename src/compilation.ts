import { output } from "./logger";
import * as vscode from 'vscode';
import { compileLatexJs, getConfiguration } from "./common";
import * as fs from 'fs';
import * as path from 'path';

const compileForEditor = async (editor: vscode.TextEditor, alertWhenSuccess: boolean) => {
    try {
        vscode.window.setStatusBarMessage(`LaTeX.js: Compiling ${editor.document.fileName}`);
        const html = await compileLatexJs(editor);
        const dir = path.dirname(editor.document.uri.fsPath);
        const filepath = path.join(dir, `${editor.document.fileName}.html`);
        fs.writeFile(filepath, html, `utf8`, () => {
            if (alertWhenSuccess) {
                vscode.window.showInformationMessage(`LaTeX.js compilation succeeded`);
            }
        });
    }
    catch (err) {
        output(`[Compilation failed]: ${err}`);
        vscode.window.showErrorMessage(`LaTeX.js compilation failed. Please refer to LaTeX.js output for details`);
    }
    vscode.window.setStatusBarMessage(``);
};

export const compile = async (context: vscode.ExtensionContext) => {
    try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            throw new Error(`LaTeX.js: Cannot open preview: No active text editor open.`);
        }

        await compileForEditor(editor, true);

        const compileOnSave: boolean = (await getConfiguration(editor.document)).compileOnSave;
        if (compileOnSave) {
            context.subscriptions.push(
                vscode.workspace.onDidSaveTextDocument(d => {
                    if (d === editor.document) {
                        compileForEditor(editor, false);
                    }
                })
            );
        }
    }
    catch (err) {
        vscode.window.showErrorMessage(err);
    }
};