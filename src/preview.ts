import * as vscode from 'vscode';
import { getConfiguration } from './common';
import { createWebviewPanel, updateWebviewForEditor } from './webview';

// maps from filename to webview panel
let panelRecords: Record<string, vscode.WebviewPanel>;

const openPreviewForViewColumn = async (context: vscode.ExtensionContext, viewColumn: vscode.ViewColumn) => {
    try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            throw new Error(`LaTeX.js: Cannot open preview: No active text editor open.`);
        }
        const panel = await createWebviewPanel(editor, viewColumn);
        updateWebviewForEditor(editor, panel);

        const refreshPreviewLive: boolean = (await getConfiguration(editor.document)).refreshPreviewLive;

        const filename = editor.document.fileName;
        panelRecords = { ...panelRecords, [filename]: panel };

        let sub: vscode.Disposable | undefined;
        if (refreshPreviewLive) {
            sub = vscode.workspace.onDidChangeTextDocument(e => {
                if (e && e.document === editor.document) {
                    updateWebviewForEditor(editor, panel);
                }
            });
            context.subscriptions.push(sub);
        }
        
        panel.onDidDispose(() => {
            if (sub) sub.dispose();
            delete panelRecords[filename];
        });
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

export const refreshPreview = async () => {
    try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            throw new Error(`LaTeX.js: Cannot open preview: No active text editor open.`);
        }
        const filename = editor.document.fileName;
        if (filename in panelRecords) {
            updateWebviewForEditor(editor, panelRecords[filename]);
        }
        else {
            throw new Error(`LaTeX.js: Cannot refresh preview: please open a preview for the current file first.`);
        }
    }
    catch (err) {
        vscode.window.showErrorMessage(err);
    }
};