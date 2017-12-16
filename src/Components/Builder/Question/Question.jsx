import React, { Component } from 'react';

class Question extends Component {
    render() {
        return(
            <div id="container">
                <h3>Question</h3>
                <div className="togglebtn">
                    <div className="text">T</div>
                    <div className="latex" onClick={this.props.handleLatexDisplay}>&sum;</div>
                </div>
                <textarea name="question" onChange={this.props.handleTextChange} rows="8" className="custominput question"/>
            </div>
        )
    }
}

export default Question;