import React, { Component } from 'react';
import 'froala-editor/js/froala_editor.pkgd.min.js';

import FroalaEditor from 'react-froala-wysiwyg';

class Question extends Component {
    render() {
        return(
            <div id="container">
                <h3>Question</h3>
                <div className="togglebtn">
                    <div className="text">T</div>
                    <div className="latex" onClick={this.props.handleLatexDisplay}>&sum;</div>
                </div>

                <FroalaEditor config={{
                    height: 100,
                    placeholderText: 'Edit Your Content Here!',
                    imageUploadURL: '/api/upload',
                    charCounterCount: false,
                    toolbarButtons: ['bold', 'italic', 'underline','insertImage','subscript', 'superscript', 'align','fontSize','color','|','undo','redo']
                }} tag='textarea' model={this.props.model} onModelChange={this.props.handleTextChange}/>
                <div className="hints">
                    <input placeholder="Type hints here" value={this.props.hints} onChange={this.props.changeHints} type="text"/>
                </div>
            </div>
        )
    }
}

export default Question;