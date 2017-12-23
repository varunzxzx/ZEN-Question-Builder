import React, { Component } from 'react';
import Question from '../Question/Question';
import axios from 'axios';
import Latex from '../Latex/Latex';
import FroalaEditor from 'react-froala-wysiwyg';
import {InlineTex} from 'react-tex';

const isEmpty = (obj) => {
    console.log(obj)
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
class ShortAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayLatex: false,
            question: "",
            answer: "",
            loading: false,
            type: "shortanswer",
            preview: false,
            id: 1
        }
    }

    handleLatexDisplay = () => {
        this.setState({displayLatex: !this.state.displayLatex})
    }

    handleTextChange = (model) => {
        this.setState({question: model})
    }

    handleAnswer = (model) => {
        this.setState({answer: model})
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
                    alert("Posted successfully")
                    location.reload()
                })
                .catch(function (error) {
                    thiss.setState({loading: false})
                    alert("Something went wrong");
                });
            }
        }
    }

    preview = () => {
        if(!this.state.question || !this.state.answer) {
            alert("Fields missing")
        } else {
            this.setState({preview: true},() => {
                // document.querySelector(".answer").innerHTML = this.state.answer
            })
        }
    }

    removeWrapper = () => {
        var elements = document.querySelectorAll("a[target='_blank'");
        if(!isEmpty(elements)) {
            for (let key in elements) {
                elements[key].parentNode.removeChild(elements[key]);
            }
        }
    }

    componentDidMount() {
        this.removeWrapper()
    }

    componentDidUpdate() {
        this.removeWrapper()
    }

    componentWillUnmount() {
        clearInterval(this.state.id)
    }

    // removeWrapper = () => {
    //     if(window.location.href.indexOf("local") === -1) {
    //         var elements = document.querySelectorAll(".fr-wrapper.show-placeholder > div:nth-of-type(1)");
    //         for (let key in elements) {
    //             elements[key].parentNode.removeChild(elements[key]);
    //         }
    //     }
    // }

    // componentDidUpdate() {
    //     this.removeWrapper();
    // }

    // componentDidMount() {
    //     this.removeWrapper();
    // }

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

                        <FroalaEditor config={{
                            placeholderText: 'Edit Your Content Here!',
                            imageUploadURL: '/api/upload',
                            htmlAllowedTags: ['svg','g','text'],
                            charCounterCount: false,
                            toolbarButtons: ['bold', 'italic', 'underline','insertImage','subscript', 'superscript', 'align','fontSize','color','|','undo','redo']
                        }} tag='textarea' onModelChange={this.handleAnswer}/>

                </div>
                <div>
                    <div onClick={this.submit} className="submit">{this.state.loading?"WAIT" : "SUBMIT"}</div>
                    <div onClick={this.preview} className="preview">PREVIEW</div>
                </div>
                {this.state.preview && <div className="preview-display">
                        <div style={{textAlign: "center"}}><b>Question</b></div>
                        <div className="question"><InlineTex texContent={this.state.question}/></div>
                        <div style={{textAlign: "center"}}><b>Answer</b></div>
                        <div className="answer"><InlineTex texContent={this.state.answer}/></div>
                        <img onClick={() => {this.setState({preview: false})}} src="assets/cross.png" style={{position: "absolute", top: "5px", right: "10px", width: "28px", height: "28px", cursor: "pointer"}} alt="Close"/>
                    </div>}
                {this.state.displayLatex && <Latex handleLatexDisplay={this.handleLatexDisplay}/>}
            </div>
        )
    }
}

export default ShortAnswer;