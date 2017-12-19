import React, { Component } from 'react';
let MyScript = require('./myscript.min.js');

class Latex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latex: ""
        }
    }
    componentDidMount() {
        var editorElement = document.getElementById('editor');
        // eslint-disable-next-line
        var resultElement = document.getElementById('result');
        var undoElement = document.getElementById('undo');
        var redoElement = document.getElementById('redo');
        var clearElement = document.getElementById('clear');
        var convertElement = document.getElementById('convert');
        let changeState = (tmpLatex) => {
            this.setState({latex: tmpLatex});
        }
        editorElement.addEventListener('changed', function (evt) {
          clearElement.disabled = !evt.detail.canClear;
          undoElement.disabled = !evt.detail.canUndo;
          redoElement.disabled = !evt.detail.canRedo;
          convertElement.disabled = !evt.detail.canConvert;
        });
        editorElement.addEventListener('exported', function (evt) {
          var exports = evt.detail.exports;
          let tmpLatex;
          if (exports && exports['application/x-latex']) {
            tmpLatex = exports['application/x-latex'];
          } else if (exports && exports['application/mathml+xml']) {
            tmpLatex = exports['application/mathml+xml'];
          } else if (exports && exports['application/mathofficeXML']) {
            tmpLatex = exports['application/mathofficeXML'];
          } else {
            tmpLatex = '';
          }
          changeState(tmpLatex);
        });

        undoElement.addEventListener('click', function () {
          editorElement.editor.undo();
        });
        redoElement.addEventListener('click', function () {
          editorElement.editor.redo();
        });
        clearElement.addEventListener('click', function () {
          editorElement.editor.clear();
        });
        convertElement.addEventListener('click', function () {
          editorElement.editor.convert();
          let svg = document.querySelector("svg");
          console.log(svg);
        });
        MyScript.register(editorElement, {
            recognitionParams: {
              type: 'MATH',
              protocol: 'WEBSOCKET',
              apiVersion: 'V4',
              server: {
                scheme: 'https',
                host: 'webdemoapi.myscript.com',
                applicationKey: 'ed4b2203-940e-46fc-affa-0a3d5a6a5aa7',
                hmacKey: '325c3d9a-372f-4046-9294-f5d5e9a5ce2d'
              },
              v4: {
                math: {
                  mimeTypes: ['application/x-latex']
                }
              }
            }
          });
    
          window.addEventListener('resize', function () {
            editorElement.editor.resize();
          });
    }
    submitLatex = () => {
        if(this.state.latex) {
            this.fnSelect("result");
        }
        this.props.handleLatexDisplay();
    }

    fnSelect = (objId) =>
    {
    this.fnDeSelect();
    if (document.selection)
    {
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(objId));
    range.select();
    }
    else if (window.getSelection)
    {
        // eslint-disable-next-line
    var range = document.createRange();
    range.selectNode(document.getElementById(objId));
    window.getSelection().addRange(range);
    }
    document.execCommand("copy");
    }

    fnDeSelect = () =>
    {
    if (document.selection)
    document.selection.empty();
    else if (window.getSelection)
    window.getSelection().removeAllRanges();
    }
    

    render() {
        return(
                <div id="latex">
                    <div id="result">&#60;l&#62;{this.state.latex}&#60;&#47;l&#62;</div>
                    <nav>
                        <button className="action-button" id="clear" disabled></button>
                        <button className="action-button" id="undo" disabled></button>
                        <button className="action-button" id="redo" disabled></button>
                        <div className="spacer"></div>
                        <button className="action-label-button" id="convert" disabled>Convert</button>
                        <button className="action-label-button" onClick={this.submitLatex} id="done">Done</button>
                    </nav>
                    <div id="editor"></div>
                </div>
        )
    }
}

export default Latex;