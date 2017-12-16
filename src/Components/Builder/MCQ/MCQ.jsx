import React, { Component } from 'react';
import Question from '../Question/Question';
import Option from '../Option/Option';
import Latex from '../Latex/Latex';

class MCQ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: -1,
            options: [0,1],
            nOptions: 2,
            displayLatex: false,
            question: "",
            optionsText: ["",""]
        }
    }

    handleLatexDisplay = () => {
        this.setState({displayLatex: !this.state.displayLatex})
    }

    submit = () => {
        console.log("Question: " + this.state.question);
        this.state.optionsText.map((option,i) => (
            console.log("Option " + (i+1) + ": " + option)
        ))
        let i = this.state.options.indexOf(this.state.checked);
        console.log(i+1);
    }

    handleOptions = (e) => {
        let tmpOptions = this.state.options;
        let i = tmpOptions.indexOf(parseInt(e.target.name,10));
        let tmpOptionsText = this.state.optionsText;
        tmpOptionsText[i] = e.target.value;
        this.setState({optionsText: tmpOptionsText})
    }

    handleTextChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
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
        this.setState({checked: i});
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
                <Question handleLatexDisplay={this.handleLatexDisplay} handleTextChange={this.handleTextChange}/>
                <h3 style={{padding: "10px", background: "#388287", margin: "0", color: "white"}}>Choices</h3>
                {this.state.options.map(key => (
                    <Option handleOptions={this.handleOptions} handleLatexDisplay={this.handleLatexDisplay} addOption={this.addOption} handleCheck={this.handleCheck} checked={this.state.checked} removeOption={this.removeOption} i={key} key={key}/>
                ))}
                <div>
                    <div onClick={this.submit} className="submit">SUBMIT</div>
                    <div className="preview">PREVIEW</div>
                </div>
                {this.state.displayLatex && <Latex handleLatexDisplay={this.handleLatexDisplay}/>}
            </div>
        )
    }
}

export default MCQ;