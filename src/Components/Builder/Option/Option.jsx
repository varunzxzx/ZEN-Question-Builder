import React, { Component } from 'react';

class Option extends Component {
    render() {
        const i = this.props.i;
        const checked = this.props.checked;
        return(
            <div className="option">
                <div className="btns">
                    <label>
                        <input type="checkbox" onChange={() => {this.props.handleCheck(i)}} checked={checked === i?true:false} name="option"/>
                        <span className="checkmark"></span>
                    </label>
                    <img onClick={this.props.addOption} className="addbtn" src="assets/add.png" alt=""/>
                    <img onClick={() => {this.props.removeOption(i)}} className="addbtn" src="assets/delete.png" alt=""/>
                </div>
                <div className="textarea">
                    <div className="togglebtn">
                        <div className="text">T</div>
                        <div className="latex" onClick={this.props.handleLatexDisplay}>&sum;</div>
                    </div>
                    <textarea name={i} onChange={this.props.handleOptions} rows="4" cols={this.props.col || "57"} className="custominput"/>
                </div>
            </div>
        )
    }
}

export default Option;