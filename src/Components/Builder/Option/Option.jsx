import React, { Component } from 'react';
import 'froala-editor/js/froala_editor.pkgd.min.js';

import FroalaEditor from 'react-froala-wysiwyg';
const alpha = (num) => {
    const APLHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return APLHA.charAt(num-1)
}

class Option extends Component {
    render() {
        const i = this.props.i;
        const checked = this.props.checked;
        return(
            <div className="option">
                <div className="btns">
                    <label>
                        <input type="checkbox" onChange={() => {this.props.handleCheck(i)}} checked={checked.indexOf(i) !== -1?true:false} name="option"/>
                        <span className="checkmark"></span>
                    </label>
                    <img onClick={this.props.addOption} className="addbtn" src="assets/add.png" alt=""/>
                    <img onClick={() => {this.props.removeOption(i)}} className="addbtn" src="assets/delete.png" alt=""/>
                </div>
                <div className="latex" style={{borderRadius: "50%", fontWeight: "700", position: "relative", top: "10px"}}>{this.props.showNum?this.props.num:alpha(this.props.num)}</div>
                <div className="textarea">
                    <div className="togglebtn">
                        <div className="text">T</div>
                        <div className="latex" onClick={this.props.handleLatexDisplay}>&sum;</div>
                    </div>
                    {/* <textarea name={i} onChange={this.props.handleOptions} rows="4" cols={this.props.col || "57"} className="custominput"/> */}
                    <div style={{ padding: "5px", boxShadow: "0 1px 3px rgba(0,0,0,.12), 0 1px 1px 1px rgba(0,0,0,.16)"}}>
                        <FroalaEditor config={{
                            placeholderText: '',
                            imageUploadURL: '/api/upload',
                            htmlAllowedTags: ['svg','g','text'],
                            toolbarInline: true,
                            charCounterCount: false,
                            toolbarButtons: ['bold', 'italic', 'underline','insertImage','subscript', 'superscript', 'align','fontSize','color','|','undo','redo']
                        }} tag='textarea' onModelChange={(model) => {this.props.handleOptions(model,this.props.i)}}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Option;