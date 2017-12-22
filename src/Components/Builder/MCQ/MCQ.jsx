import React, { Component } from 'react';
import Question from '../Question/Question';
import Option from '../Option/Option';
import Latex from '../Latex/Latex';
import axios from 'axios';

class MCQ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: [],
            options: [0,1],
            nOptions: 2,
            displayLatex: false,
            question: "",
            optionsText: ["",""],
            loading: false,
            success: false,
            type: 'mcq',
            preview: false
        }
    }

    handleLatexDisplay = () => {
        this.setState({displayLatex: !this.state.displayLatex})
    }

    submit = () => {
        if(!this.state.checked || !this.state.question || !this.state.optionsText) {
            alert("Fields missing")
        } else {
            const correct = []
            console.log("Question: " + this.state.question);
            this.state.optionsText.map((option,i) => (
                console.log("Option " + (i+1) + ": " + option)
            ))
            this.state.checked.map((checked,i) => {
                if(this.state.options.indexOf(checked) !== -1) {
                    correct.push(this.state.options.indexOf(checked))
                }
            })
            console.log(this.props.tags)
            console.log(correct);
            if(!this.state.loading) {
                const thiss = this;
                this.setState({loading: true})
                const payload = {
                    question: this.state.question,
                    type: this.state.type,
                    options: this.state.optionsText,
                    correct: correct,
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

    handleOptions = (model,e) => {
        let tmpOptions = this.state.options;
        let i = tmpOptions.indexOf(parseInt(e,10));
        let tmpOptionsText = this.state.optionsText;
        tmpOptionsText[i] = model;
        this.setState({optionsText: tmpOptionsText})
    }

    handleTextChange = (model) => {
        this.setState({question: model})
    }

    addOption = () => {
        let builder = document.querySelector('#builder');        
        let tmpOptions = this.state.options;
        let tmpNOptions = this.state.nOptions;
        tmpNOptions++;
        tmpOptions.push(tmpNOptions);
        let tmpOptionsText = this.state.optionsText;
        tmpOptionsText.push("");
        this.setState({options: tmpOptions, nOptions: tmpNOptions,optionsText: tmpOptionsText},() => {
            builder.scrollTop = builder.scrollHeight;
        });
    }

    handleCheck = (i) => {
        let tmpChecked = this.state.checked;
        if(tmpChecked.indexOf(i) === -1) {
            tmpChecked.push(i);
        } else {
            tmpChecked.splice(tmpChecked.indexOf(i),1);
        }
        this.setState({checked: tmpChecked});
    }

    removeOption = (i) => {
        let tmpOptions = this.state.options;
        let tmpNOptions = this.state.nOptions;
        tmpNOptions--;
        let tmpOptionsText = this.state.optionsText;
        tmpOptionsText.pop();
        if(tmpOptions.length>2) {
            tmpOptions.splice(tmpOptions.indexOf(i),1);
            this.setState({options: tmpOptions, nOptions: tmpNOptions, optionsText: tmpOptionsText});
        }
    }

    preview = () => {
        if(!this.state.question || !this.state.optionsText) {
            alert("Fields missing")
        } else {
            this.setState({preview: true},() => {
                document.querySelector(".question").innerHTML = this.state.question
                {this.state.optionsText.map((option,i) => {
                    document.querySelector(`.option${i}`).innerHTML = `<b>${i+1}.</b>${option}`
                    // return (<div className={`option${i}`}></div>)
                })}
            })
        }
    }

    componentDidMount() {
        if(window.location.href.indexOf("local") === -1) {
            var elements = document.querySelectorAll(".fr-wrapper.show-placeholder > div:nth-of-type(1)");
            for (let key in elements) {
                elements[key].parentNode.removeChild(elements[key]);
            }
        }
    }

    render() {
        return(
            <div>
                <Question model={this.state.question} handleLatexDisplay={this.handleLatexDisplay} handleTextChange={this.handleTextChange}/>
                <h3 style={{padding: "10px", background: "#388287", margin: "0", color: "white"}}>Choices</h3>
                {this.state.options.map((key,i) => (
                    <Option handleOptions={this.handleOptions} handleLatexDisplay={this.handleLatexDisplay} addOption={this.addOption} handleCheck={this.handleCheck} checked={this.state.checked} removeOption={this.removeOption} num={i+1} i={key} key={key}/>
                ))}
                <div>
                    <div onClick={this.submit} className="submit" disabled>{this.state.loading?"WAIT" : "SUBMIT"}</div>
                    <div className="preview" onClick={this.preview}>PREVIEW</div>
                </div>
                {this.state.preview && <div className="preview-display">
                        <div style={{textAlign: "center"}}><b>Question</b></div>
                        <div className="question"></div>
                        <div style={{textAlign: "center"}}><b>Options</b></div>
                        {this.state.optionsText.map((option,i) => {
                            return (<div key={i} className={`option${i}`}></div>)
                        })}
                        <img onClick={() => {this.setState({preview: false})}} src="assets/cross.png" style={{position: "absolute", top: "5px", right: "10px", width: "28px", height: "28px", cursor: "pointer"}} alt="Close"/>
                    </div>}
                {this.state.displayLatex && <Latex handleLatexDisplay={this.handleLatexDisplay}/>}
            </div>
        )
    }
}

export default MCQ;