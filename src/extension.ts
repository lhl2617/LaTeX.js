import * as vscode from 'vscode';
import { openPreview, openPreviewToTheSide } from './preview';


export const activate = (context: vscode.ExtensionContext) => {
    context.subscriptions.push(
        vscode.commands.registerCommand(`latex.js.openPreview`, () => {
            openPreview(context);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(`latex.js.openPreviewToTheSide`, () => {
            openPreviewToTheSide(context);
        })
    );
    // context.subscriptions.push(
    //     vscode.commands.registerCommand(`latex.js.compile`, () => {
    //         compile();
    //     })
    // );
};
