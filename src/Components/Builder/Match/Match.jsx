import React, { Component } from 'react';
import Question from '../Question/Question';
import Option from '../Option/Option';
import Latex from '../Latex/Latex';
import axios from 'axios';
class Match extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayLatex: false,
            column1: [0,1,2],
            nCol1:3,
            column2: [0,1,2],
            nCol2: 3,
            question: "",
            col1Text: ["","",""],
            col2Text: ["","",""],
            answers: {},
            loading: false,
            type: "match"
        }
    }

    submit = () => {
        if(!this.state.col1Text || !this.state.question || !this.state.col2Text || !this.state.col2Text) {
            alert("Fields missing")
        } else {
            console.log("Question: " + this.state.question);
            console.log("Column 1")
            this.state.col1Text.map(col => {
                console.log(col)
            })
            console.log("Column 2")
            this.state.col2Text.map(col => {
                console.log(col)
            })
            console.log(this.state.answers)
            if(!this.state.loading) {
                const thiss = this;
                this.setState({loading: true})
                const payload = {
                    question: this.state.question,
                    type: this.state.type,
                    col1: this.state.col1Text,
                    col2: this.state.col2Text,
                    tags: this.props.tags,
                    matchAnswer: this.state.answers
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

    handleCol1 = (e) => {
        let tmpColumn1 = this.state.column1;
        let i = tmpColumn1.indexOf(parseInt(e.target.name,10));
        let tmpCol1Text = this.state.col1Text;
        tmpCol1Text[i] = e.target.value;
        this.setState({col1Text: tmpCol1Text})
    }

    handleCol2 = (e) => {
        let tmpColumn2 = this.state.column2;
        let i = tmpColumn2.indexOf(parseInt(e.target.name,10));
        let tmpCol2Text = this.state.col2Text;
        tmpCol2Text[i] = e.target.value;
        this.setState({col2Text: tmpCol2Text})
    }

    addOption = () => {
        let builder = document.querySelector('#builder');        
        let tmpColumn1 = this.state.column1;
        let tmpNCol1 = this.state.nCol1;
        let tmpColumn2 = this.state.column2;
        let tmpNCol2 = this.state.nCol2;
        tmpNCol1++;
        tmpColumn1.push(tmpNCol1);
        tmpNCol2++;
        tmpColumn2.push(tmpNCol2);
        let tmpCol1Text = this.state.col1Text;
        let tmpCol2Text = this.state.col2Text;
        tmpCol1Text.push("");
        tmpCol2Text.push("");
        this.setState({
            column1: tmpColumn1,
            column2: tmpColumn2,
            nCol1: tmpNCol1,
            nCol2: tmpNCol2,
            col1Text: tmpCol1Text,
            col2Text: tmpCol2Text
        },() => {
            builder.scrollTop = builder.scrollHeight;
        });
    }

    addColumn2 = () => {
        let builder = document.querySelector('#builder');
        let tmpColumn2 = this.state.column2;
        let tmpNCol2 = this.state.nCol2;
        tmpNCol2++;
        tmpColumn2.push(tmpNCol2);
        let tmpCol2Text = this.state.col2Text;
        tmpCol2Text.push("");
        this.setState({column2: tmpColumn2, nCol2: tmpNCol2, col2Text: tmpCol2Text},() => {
            builder.scrollTop = builder.scrollHeight;
        })
    }

    handleCheck = (i) => {
    }

    removeOption = (i) => {
        let tmpColumn1 = this.state.column1;
        let tmpNCol1 = this.state.nCol1;
        tmpNCol1--;
        let tmpCol1Text = this.state.col1Text;
        tmpCol1Text.pop();
        if(tmpColumn1.length>3) {
            tmpColumn1.splice(tmpColumn1.indexOf(i),1);
            this.setState({column1: tmpColumn1, nCol1: tmpNCol1, col1Text: tmpCol1Text});
        }
    }

    removeColumn2 = (i) => {
        let tmpColumn2 = this.state.column2;
        let tmpNCol2 = this.state.nCol2;
        tmpNCol2--;
        let tmpCol2Text = this.state.col2Text;
        tmpCol2Text.pop();
        if(tmpColumn2.length>3) {
            tmpColumn2.splice(tmpColumn2.indexOf(i),1);
            this.setState({column2: tmpColumn2, nCol2: tmpNCol2, col2Text: tmpCol2Text});
        }
    }
    
    handleTextChange = (model) => {
        this.setState({question: model})
    }

    handleLatexDisplay = () => {
        this.setState({displayLatex: !this.state.displayLatex})
    }

    handleAnswer = (e) => {
        const answers = this.state.answers;
        answers[parseInt(e.target.name,10)] = e.target.value;
        this.setState({answers})
    }

    render() {
        return(
            <div>
                <Question question={this.state.question}  handleLatexDisplay={this.handleLatexDisplay} handleTextChange={this.handleTextChange}/>
                <div className="cols">
                    <div className="col1">
                    {this.state.column1.map(key => (
                        <Option handleOptions={this.handleCol1} col={21} handleLatexDisplay={this.handleLatexDisplay} addOption={this.addOption} handleCheck={this.handleCheck} checked={[]} removeOption={this.removeOption} i={key} key={key}/>
                    ))}
                    </div>
                    <div className="col2">
                    {this.state.column2.map(key => (
                        <Option handleOptions={this.handleCol2} col={21} handleLatexDisplay={this.handleLatexDisplay} addOption={this.addColumn2} handleCheck={this.handleCheck} checked={[]} removeOption={this.removeColumn2} i={key} key={key}/>
                    ))}
                    </div>
                </div>
                <div id="container" style={{borderTop: "4px solid #388287"}}>
                    <h3>Answer</h3>
                    {
                        this.state.column1.map((key,i) => (
                            <div className="match-answer" key={i}>
                                {i+1}: <span><input type="text" name={i} onChange={this.handleAnswer}/></span>
                            </div>
                        ))
                    }
                </div>
                <div>
                    <div onClick={this.submit} className="submit">SUBMIT</div>
                    <div className="preview">PREVIEW</div>
                </div>
                {this.state.displayLatex && <Latex handleLatexDisplay={this.handleLatexDisplay}/>}
            </div>
        )
    }
}

export default Match;