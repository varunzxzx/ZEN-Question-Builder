import React, { Component } from 'react';
import Question from '../Question/Question';
class ShortAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayLatex: false,
            question: "",
            answer: ""
        }
    }

    handleLatexDisplay = () => {
        this.setState({displayLatex: !this.state.displayLatex})
    }

    handleTextChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    submit = () => {
        console.log("Question: " + this.state.question);
        console.log("Answer: " + this.state.answer);
    }

    render() {
        return(
            <div>
                <Question handleLatexDisplay={this.handleLatexDisplay} handleTextChange={this.handleTextChange}/>
                <div id="container" style={{borderTop: "4px solid #388287"}}>
                    <h3>Answer</h3>
                    <div className="togglebtn">
                        <div className="text">T</div>
                        <div className="latex" onClick={this.state.handleLatexDisplay}>&sum;</div>
                    </div>
                    <textarea onChange={this.handleTextChange} name="answer" rows="8" className="custominput question"/>
                </div>
                <div>
                    <div onClick={this.submit} className="submit">SUBMIT</div>
                    <div className="preview">PREVIEW</div>
                </div>
            </div>
        )
    }
}

export default ShortAnswer;