import React, { Component } from 'react';
import Question from '../Question/Question';
import axios from 'axios';
import Latex from '../Latex/Latex';
import FroalaEditor from 'react-froala-wysiwyg';
import {InlineTex} from 'react-tex';
import Option from '../Option/Option.jsx'

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
            isLoading: false,
            type: "shortanswer",
            preview: false,
            hints: [0],
            nHints: 1,
            hintsText: [""]
        }
    }

    handleHints = (e) => {
        this.setState({hints: e.target.value})
    }

    reInit = () => {
        this.setState({
            displayLatex: false,
            question: "",
            answer: "",
            isLoading: false,
            type: "shortanswer",
            preview: false,
            hints: [0],
            nHints: 1,
            hintsText: [""]
        })
        this.props.reInit()
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

    handleHints = (model,e) => {
        let tmpOptions = this.state.hints;
        let i = tmpOptions.indexOf(parseInt(e,10));
        let tmpOptionsText = this.state.hintsText;
        tmpOptionsText[i] = model;
        this.setState({hintsText: tmpOptionsText})
    }

    addHint = () => {
        let builder = document.querySelector('#builder');        
        let tmpOptions = this.state.hints;
        let tmpNOptions = this.state.nHints;
        tmpNOptions++;
        tmpOptions.push(tmpNOptions);
        let tmpOptionsText = this.state.hintsText;
        tmpOptionsText.push("");
        this.setState({hints: tmpOptions, nHints: tmpNOptions,hintsText: tmpOptionsText},() => {
            builder.scrollTop = builder.scrollHeight;
        });
    }

    removeHint = (i) => {
        let tmpOptions = this.state.hints;
        let tmpNOptions = this.state.nHints;
        tmpNOptions--;
        let tmpOptionsText = this.state.hintsText;
        tmpOptionsText.pop();
        if(tmpOptions.length>1) {
            tmpOptions.splice(tmpOptions.indexOf(i),1);
            this.setState({hints: tmpOptions, nHints: tmpNOptions, hintsText: tmpOptionsText});
        }
    }

    submit = () => {
        if(!this.state.answer || !this.state.question) {
            alert("Fields missing")
        } else {
            let question = this.state.question;
            let images = {};
            let imgN = 0;

            while(question.indexOf("<img") !== -1) {
                let start = question.indexOf("<img");
                let end = question.indexOf("\">")
                console.log(start)
                console.log(end)
                console.log(question.substring(start,end+2))

                let src = "",ch = question.substring(question.indexOf("src=\"")+5,question.indexOf("src=\"")+6);
                console.log(`ch= ${ch}`)
                let i = 5;
                while(ch !== "\"") {
                    src = src + ch;
                    i++;
                    ch = question.substring(question.indexOf("src=\"")+i,question.indexOf("src=\"")+i+1);
                }
                console.log(src)

                images[imgN] = src;
                question = question.replace(question.substring(start,end+2),`@@${imgN}@@`)
                imgN++;
                console.log(question)
            }
            question = question.replace(/&nbsp;/g," ")
            question = question.replace(/=/g,"##61##")
            question = question.replace(/&gt;/g,">")
            question = question.replace(/&lt;/g,"<")
            question = question.replace(/&amp;/g,"and")
            let answer = this.state.answer;
            let imagesAns = {}
            let imgAnsN = 0
            while(answer.indexOf("<img") !== -1) {
                let start = answer.indexOf("<img");
                let end = answer.indexOf("\">")
                console.log(start)
                console.log(end)
                console.log(answer.substring(start,end+2))

                let src = "",ch = answer.substring(answer.indexOf("src=\"")+5,answer.indexOf("src=\"")+6);
                console.log(`ch= ${ch}`)
                let i = 5;
                while(ch !== "\"") {
                    src = src + ch;
                    i++;
                    ch = answer.substring(answer.indexOf("src=\"")+i,answer.indexOf("src=\"")+i+1);
                }
                
                imagesAns[imgAnsN] = src;
                answer = answer.replace(answer.substring(start,end+2),`@@${imgAnsN}@@`)
                imgAnsN++;
                console.log(answer)
            }
            answer = answer.replace(/&nbsp;/g," ")
            answer = answer.replace(/=/g,"##61##")
            answer = answer.replace(/&gt;/g,">")
            answer = answer.replace(/&lt;/g,"<")
            answer = answer.replace(/&amp;/g,"and")
            let hintss = this.state.hintsText;
            let HINTS = []
            if(hintss) {
                HINTS = hintss.map((option,i) => {
                    while(option.indexOf("<img") !== -1) {
                        let start = option.indexOf("<img");
                        let end = option.indexOf("\">")
                        console.log(start)
                        console.log(end)
                        console.log(option.substring(start,end+2))
        
                        let src = "",ch = option.substring(option.indexOf("src=\"")+5,option.indexOf("src=\"")+6);
                        console.log(`ch= ${ch}`)
                        let i = 5;
                        while(ch !== "\"") {
                            src = src + ch;
                            i++;
                            ch = option.substring(option.indexOf("src=\"")+i,option.indexOf("src=\"")+i+1);
                        }
                        
                        images[imgN] = src;
                        option = option.replace(option.substring(start,end+2),`@@${imgN}@@`)
                        imgN++;
                        console.log(option)
                    }
                    option = option.replace(/&nbsp;/g," ")
                    option = option.replace(/=/g,"##61##")
                    option = option.replace(/&gt;/g,">")
                    option = option.replace(/&amp;/g,"and")
                    return option.replace(/&lt;/g,"<")
                })
            }
            if(!this.state.isLoading) {
                const thiss = this;
                this.setState({isLoading: true})
                const payload = {
                    question: question,
                    type: this.state.type,
                    answer: answer,
                    images: images,
                    tags: this.props.tags,
                    imagesAns: imagesAns,
                    hints: HINTS.length === 0?null : HINTS
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
                try {
                    elements[key].parentNode.removeChild(elements[key]);
                } catch(err) {
                    // do nothing
                }            }
        }
    }

    componentDidMount() {
        this.removeWrapper()
    }

    componentDidUpdate() {
        this.removeWrapper()
    }

    handleCheck = (i) => {
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
                <Question hints={this.state.hints} changeHints={this.handleHints} model={this.state.question} handleLatexDisplay={this.handleLatexDisplay} handleTextChange={this.handleTextChange}/>
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
                        }} tag='textarea' model={this.state.answer} onModelChange={this.handleAnswer}/>

                </div>
                <h3 style={{padding: "10px", background: "#388287", margin: "0", color: "white"}}>Hints</h3>
                {this.state.hints.map((key,i) => (
                    <Option model={this.state.hintsText[i]} handleOptions={this.handleHints} handleLatexDisplay={this.handleLatexDisplay} addOption={this.addHint} handleCheck={this.handleCheck} checked={[]} removeOption={this.removeHint} num={i+1} i={key} key={i}/>
                ))}
                <div>
                    <div onClick={this.preview} className="preview">PREVIEW</div>
                </div>
                {this.state.preview && <div className="preview-display">
                        <div style={{textAlign: "center"}}><b>Question</b></div>
                        <div className="question"><InlineTex texContent={this.state.question}/></div>
                        <div style={{textAlign: "center"}}><b>Answer</b></div>
                        <div className="answer"><InlineTex texContent={this.state.answer}/></div>
                        <img onClick={() => {this.setState({preview: false})}} src="assets/cross.png" style={{position: "absolute", top: "5px", right: "10px", width: "28px", height: "28px", cursor: "pointer"}} alt="Close"/>
                        <div>
                            <div onClick={this.submit} className="submit">{this.state.isLoading?"WAIT" : "SUBMIT"}</div>
                        </div>
                    </div>}
                {this.state.displayLatex && <Latex handleLatexDisplay={this.handleLatexDisplay}/>}
            </div>
        )
    }
}

export default ShortAnswer;