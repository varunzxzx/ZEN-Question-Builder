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
            type: 'mcq'
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
                    location.reload()
                })
                .catch(function (error) {
                    thiss.setState({loading: false})
                    alert("Something went wrong");
                });
            }
        }
    }

    handleOptions = (e) => {
        let tmpOptions = this.state.options;
        let i = tmpOptions.indexOf(parseInt(e.target.name,10));
        let tmpOptionsText = this.state.optionsText;
        tmpOptionsText[i] = e.target.value;
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

    render() {
        return(
            <div>
                <Question model={this.state.question} handleLatexDisplay={this.handleLatexDisplay} handleTextChange={this.handleTextChange}/>
                <h3 style={{padding: "10px", background: "#388287", margin: "0", color: "white"}}>Choices</h3>
                {this.state.options.map(key => (
                    <Option handleOptions={this.handleOptions} handleLatexDisplay={this.handleLatexDisplay} addOption={this.addOption} handleCheck={this.handleCheck} checked={this.state.checked} removeOption={this.removeOption} i={key} key={key}/>
                ))}
                <div>
                    <div onClick={this.submit} className="submit" disabled>SUBMIT</div>
                    <div className="preview">PREVIEW</div>
                </div>
                {this.state.displayLatex && <Latex handleLatexDisplay={this.handleLatexDisplay}/>}
            </div>
        )
    }
}

export default MCQ;