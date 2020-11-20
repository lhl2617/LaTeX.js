import * as vscode from 'vscode';
import { getConfiguration } from './common';
import { createWebviewPanel, updateWebviewForEditor } from './webview';



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