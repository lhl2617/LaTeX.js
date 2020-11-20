import * as vscode from 'vscode';
import { getLatexJsGeneratorOptionsFromConfig, getLatexJsStyleOptionsFromConfig } from './common';

export const createWebviewPanel = async (editor: vscode.TextEditor, viewColumn: vscode.ViewColumn, preserveFocus = false) => {
    const panel = vscode.window.createWebviewPanel(
        `latex.js.preview`,
        `LaTeX.js Preview: ${editor.document.fileName}`,
        { viewColumn, preserveFocus },
        { enableScripts: true },
    );
    panel.webview.html = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LaTeX.js Preview: ${editor.document.fileName}</title>
    <script src="https://cdn.jsdelivr.net/npm/latex.js/dist/latex.js"></script>
    <style>
/* reset CSS */
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
    display: block;
}
body {
    line-height: 1;
}
ol, ul {
    list-style: none;
}
blockquote, q {
    quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
    content: '';
    content: none;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}

/* make background white and text black */
body {
    background-color: white;
    color: black; 
}
    </style>
</head>


<body>
    <div id="content"></div>

    <script>
        /* load stylesheet */
        const generator = new latexjs.HtmlGenerator({});
        const g = latexjs.parse("", { generator: generator }); 
        document.head.appendChild(g.stylesAndScripts("https://cdn.jsdelivr.net/npm/latex.js/dist/"));
    </script>

    <script>
        const vscode = acquireVsCodeApi();
        window.addEventListener('message', event => {
            const message = event.data;
            const { generatorConfig, styleConfig, text, mode } = message;
            const content = document.getElementById("content");
            try {
                const generator = new latexjs.HtmlGenerator(generatorConfig);
                const g = latexjs.parse(text, { generator: generator }); 

                content.innerHTML = "";
                content.appendChild(g.domFragment());

                /* set styles */
                const { margin } = styleConfig;
                content.style.margin = margin;

                /*
                if (mode === "compile") {
                    vscode.postMessage({ compilationSucceeded: true, content: g.domFragment() });
                }
                */
            }
            catch (err) {
                content.innerHTML = "<div style=\\"color: red\\">" +
                    "<h1 style=\\"font-size: 2em; margin-bottom: 30px; text-align: center\\">LaTeX.js Compilation failed</h1>" + err + 
                "</div>";
                
                /*
                if (mode === "compile") {
                    vscode.postMessage({ compilationSucceeded: false, content: undefined });
                }
                */
            }
        });
    </script>
</body>

</html>`;
    return panel;
};


export const updateWebviewForEditor = async (editor: vscode.TextEditor, panel: vscode.WebviewPanel, mode: `preview` | `compile` = `preview`) => {
    const generatorConfig = await getLatexJsGeneratorOptionsFromConfig(editor.document);
    const styleConfig = await getLatexJsStyleOptionsFromConfig(editor.document);
    panel.webview.postMessage(
        {
            text: editor.document.getText(),
            generatorConfig: generatorConfig,
            styleConfig: styleConfig,
            mode: mode,
        }
    );
};