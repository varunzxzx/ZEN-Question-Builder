import React, { Component } from 'react';
import Question from '../Question/Question';
import axios from 'axios';
class ShortAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayLatex: false,
            question: "",
            answer: "",
            loading: false,
            type: "shortanswer"
        }
    }

    handleLatexDisplay = () => {
        this.setState({displayLatex: !this.state.displayLatex})
    }

    handleTextChange = (model) => {
        this.setState({question: model})
    }

    handleAnswer = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    submit = () => {
        if(!this.state.answer || !this.state.question) {
            alert("Fields missing")
        } else {
            if(!this.state.loading) {
                const thiss = this;
                this.setState({loading: true})
                const payload = {
                    question: this.state.question,
                    type: this.state.type,
                    answer: this.state.answer,
                    tags: this.props.tags
                }
            axios({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                    url: '/api/create',
                    mode: 'cors',
                    data: JSON.stringify(payload)
                })
                .then(function (response) {
                    location.reload()
                })
                .catch(function (error) {
                    thiss.setState({loading: false})
                    alert("Something went wrong");
                });
            }
        }
    }

    render() {
        return(
            <div>
                <Question question={this.state.question} handleLatexDisplay={this.handleLatexDisplay} handleTextChange={this.handleTextChange}/>
                <div id="container" style={{borderTop: "4px solid #388287"}}>
                    <h3>Answer</h3>
                    <div className="togglebtn">
                        <div className="text">T</div>
                        <div className="latex" onClick={this.state.handleLatexDisplay}>&sum;</div>
                    </div>
                    <textarea onChange={this.handleAnswer} name="answer" rows="8" className="custominput question"/>
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