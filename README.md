# LaTeX.js for VSCode

Provides preview and compilation of LaTeX.js in VSCode.


## Requirements
* [LaTeX.js](https://latex.js.org/)
  ```
  npm i -g latex.js
  ```
  Note: If you don't want a global installation, you can specify where your `latex.js` is located in the extension [settings](docs/SETTINGS.md).

* _Optional but recommended_: [LaTeX Workshop](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop)
  * Provides syntax highlighting, autocomplete, colorise and more.
  * :exclamation: *IMPORTANT* :exclamation:: Please turn off compilation features in LaTeX Workshop to not let it interfere with this extension.
  
  
## Extension Controls, Commands and Settings
* [Commands](docs/COMMANDS.md)
* [Settings](docs/SETTINGS.md)

## Limitations 
* Does not support `CustomMacros` or `languagePatterns` in [LaTeX.js HtmlGenerator options](https://latex.js.org/api.html#class-htmlgenerator).

## Contributing
* File bugs and/or feature requests in the [GitHub repository](https://github.com/lhl2617/LaTeX.js)
* Pull requests are welcome in the [GitHub repository](https://github.com/lhl2617/LaTeX.js)
* Buy me a Coffee ☕️ via [PayPal](https://paypal.me/lhl2617)
