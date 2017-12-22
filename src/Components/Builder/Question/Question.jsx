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
                    placeholderText: 'Edit Your Content Here!',
                    imageUploadURL: '/api/upload',
                    htmlAllowedTags: ['svg','g','text'],
                    charCounterCount: false,
                    toolbarButtons: ['bold', 'italic', 'underline','insertImage','subscript', 'superscript', 'align','fontSize','color','|','undo','redo']
                }} tag='textarea' model={this.props.question} onModelChange={this.props.handleTextChange}/>

            </div>
        )
    }
}

export default Question;