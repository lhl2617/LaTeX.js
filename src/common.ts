// handles latex.js path and configuration etc.
import * as vscode from 'vscode';
import * as which from 'which';

const getLatexJsPath = async (doc: vscode.TextDocument | undefined = undefined): Promise<string> => {
    const config = await getConfiguration(doc);
    const p: string = config.pathToLatexJs;
    // set in config
    if (p.length) { return p; }
    
    try {
        // use default
        return which(`latex.js`);
    } catch (err) {
        console.error(`LaTeX.js: ${err}`);
        throw new Error(`Cannot get path to \`latex.js\`. Please make sure you have installed LaTeX.js globally or set the specific path in settings.`);
    }
};

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
    const { documentClass, hyphenate, styles } = generatorOptions;
    return {
        documentClass,
        hyphenate,
        styles
    };
};

// compile text in given editor. throwable.
export const compileLatexJs = async (editor: vscode.TextEditor): Promise<string> => {
    const text = editor.document.getText();
    const latexJsPath = await getLatexJsPath();
    const { parse, HtmlGenerator } = await import(latexJsPath);
    const generatorOptions = await getLatexJsGeneratorOptionsFromConfig(editor.document);
    const generator = new HtmlGenerator(generatorOptions);
    const html: string = parse(text, { generator }).htmlDocument().documentElement.outerHTML;
    return html;
};