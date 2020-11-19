// handles latex.js path and configuration etc.
import * as vscode from 'vscode';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { parse, HtmlGenerator } from 'latex.js';

// wrapper to get the configuration from a document if provided
export const getConfiguration = async (doc: vscode.TextDocument | undefined = undefined) => {
    // if a doc is provided use its workspace folder (this should usually be the case)
    if (doc) {
        return vscode.workspace.getConfiguration(`latex.js`, doc);
    }
    // if not, try the active text editor
    if (vscode.window.activeTextEditor) {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri);
        if (workspaceFolder) {
            return vscode.workspace.getConfiguration(`latex.js`, workspaceFolder);
        }
    }
    // try the root workspace folder if present
    if (vscode.workspace.workspaceFolders?.length) {
        const workspaceFolder = vscode.workspace.workspaceFolders[0];
        return vscode.workspace.getConfiguration(`latex.js`, workspaceFolder);
    }
    return vscode.workspace.getConfiguration(`latex.js`);
};

const getLatexJsGeneratorOptionsFromConfig = async (doc: vscode.TextDocument | undefined = undefined) => {
    const generatorOptions = (await getConfiguration(doc)).generatorOptions;
    const ret = {
        documentClass: generatorOptions.documentClass ?? `article`,
        hyphenate: generatorOptions.hyphenate ?? true,
        styles: generatorOptions.styles ?? [],
    };
    return ret;
};

// compile text in given editor. throwable.
export const compileLatexJs = async (editor: vscode.TextEditor): Promise<string> => {
    const text = editor.document.getText();
    const generatorOptions = await getLatexJsGeneratorOptionsFromConfig(editor.document);
    console.log(generatorOptions);
    const generator = new HtmlGenerator(generatorOptions);
    const html: string = parse(text, { generator }).htmlDocument().documentElement.outerHTML;
    return html;
};