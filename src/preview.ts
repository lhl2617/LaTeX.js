import * as vscode from 'vscode';
import { compileLatexJs, getConfiguration } from './common';
import { output } from './logger';

const createWebviewPanel = async (editor: vscode.TextEditor, viewColumn: vscode.ViewColumn) => {
    return vscode.window.createWebviewPanel(
        `latex.js.preview`,
        `LaTeX.js Preview: ${editor.document.fileName}`,
        viewColumn
    );
};

const updateWebviewForEditor = async (editor: vscode.TextEditor, panel: vscode.WebviewPanel) => {
    let html: string;
    vscode.window.setStatusBarMessage(`LaTeX.js: Previewing ${editor.document.fileName}`);
    try {
        html = await compileLatexJs(editor);
    }
    catch (err) {
        output(`[Preview failed]: ${err}`);
        html = `<h1>LaTeX.js Compilation Failed</h1>${err}`;
    }
    panel.webview.html = html;
    vscode.window.setStatusBarMessage(``);
};

const openPreviewForViewColumn = async (context: vscode.ExtensionContext, viewColumn: vscode.ViewColumn) => {
    try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            throw new Error(`LaTeX.js: Cannot open preview: No active text editor open.`);
        }
        const panel = await createWebviewPanel(editor, viewColumn);
        updateWebviewForEditor(editor, panel);

        const refreshPreviewLive: boolean = (await getConfiguration(editor.document)).refreshPreviewLive;

        if (refreshPreviewLive) {
            const sub = vscode.workspace.onDidChangeTextDocument(e => {
                if (e && e.document === editor.document) {
                    updateWebviewForEditor(editor, panel);
                }
            });
            context.subscriptions.push(sub);
            panel.onDidDispose(() => {
                sub.dispose();
            });
        }
    }
    catch (err) {
        vscode.window.showErrorMessage(err);
    }
};

export const openPreview = async (context: vscode.ExtensionContext) => {
    openPreviewForViewColumn(context, vscode.ViewColumn.Active);
};

export const openPreviewToTheSide = async (context: vscode.ExtensionContext) => {
    openPreviewForViewColumn(context, vscode.ViewColumn.Beside);
};