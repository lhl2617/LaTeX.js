import * as vscode from 'vscode';
import { compile } from './compilation';
import { openPreview, openPreviewToTheSide } from './preview';

export const activate = (context: vscode.ExtensionContext) => {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.openPreview', () => {
            openPreview(context);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.openPreviewToTheSide', () => {
            openPreviewToTheSide(context);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.compile', () => {
            compile(context);
        })
    );
};
