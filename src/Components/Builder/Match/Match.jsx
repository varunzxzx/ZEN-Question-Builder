import React, { Component } from 'react';
import Question from '../Question/Question';
import Option from '../Option/Option';
import Latex from '../Latex/Latex';
import axios from 'axios';

const isEmpty = (obj) => {
    console.log(obj)
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

const alpha = (num) => {
    const APLHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return APLHA.charAt(num-1)
}

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
            type: "match",
            preview: false
        }
    }

    submit = () => {
        if(!this.state.col1Text[0] || !this.state.question || !this.state.col2Text[0] || isEmpty(this.state.answers)) {
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

    handleCol1 = (model,e) => {
        let tmpColumn1 = this.state.column1;
        let i = tmpColumn1.indexOf(parseInt(e,10));
        let tmpCol1Text = this.state.col1Text;
        tmpCol1Text[i] = model;
        this.setState({col1Text: tmpCol1Text})
    }

    handleCol2 = (model,e) => {
        let tmpColumn2 = this.state.column2;
        let i = tmpColumn2.indexOf(parseInt(e,10));
        let tmpCol2Text = this.state.col2Text;
        tmpCol2Text[i] = model;
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

    preview = () => {
        if(!this.state.col1Text || !this.state.question || !this.state.col2Text) {
            alert("Fields missing")
        } else {
            this.setState({preview: true},() => {
                document.querySelector(".question").innerHTML = this.state.question
                {this.state.col1Text.map((option,i) => {
                    document.querySelector(`.col1${i}`).innerHTML = `<b>${i+1}.</b>${option}`
                })}
                {this.state.col2Text.map((option,i) => {
                    document.querySelector(`.col2${i}`).innerHTML = `<b>${i+1}.</b>${option}`
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
                <Question question={this.state.question}  handleLatexDisplay={this.handleLatexDisplay} handleTextChange={this.handleTextChange}/>
                <div className="cols">
                    <div className="col1">
                    {this.state.column1.map((key,i) => (
                        <Option num={i+1} handleOptions={this.handleCol1} col={21} handleLatexDisplay={this.handleLatexDisplay} addOption={this.addOption} handleCheck={this.handleCheck} checked={[]} removeOption={this.removeOption} i={key} key={key}/>
                    ))}
                    </div>
                    <div className="col2">
                    {this.state.column2.map((key,i) => (
                        <Option num={i+1} showNum={true} handleOptions={this.handleCol2} col={21} handleLatexDisplay={this.handleLatexDisplay} addOption={this.addColumn2} handleCheck={this.handleCheck} checked={[]} removeOption={this.removeColumn2} i={key} key={key}/>
                    ))}
                    </div>
                </div>
                <div id="container" style={{borderTop: "4px solid #388287"}}>
                    <h3>Answer</h3>
                    {
                        this.state.column1.map((key,i) => (
                            <div className="match-answer" key={i}>
                                {alpha(i+1)}: <span><input type="text" name={i} onChange={this.handleAnswer}/></span>
                            </div>
                        ))
                    }
                </div>
                <div>
                    <div onClick={this.submit} className="submit">{this.state.loading?"WAIT" : "SUBMIT"}</div>
                    <div onClick={this.preview} className="preview">PREVIEW</div>
                </div>
                {this.state.preview && <div className="preview-display">
                        <div style={{textAlign: "center"}}><b>Question</b></div>
                        <div className="question"></div>
                        <div style={{textAlign: "center"}}><b>Options</b></div>
                        <div className="cols">
                            <div className="col1">
                                {this.state.col1Text.map((option,i) => {
                                    return (<div key={i} className={`col1${i}`}></div>)
                                })}
                            </div>
                            <div className="col2">
                                {this.state.col2Text.map((option,i) => {
                                    return (<div key={i} className={`col2${i}`}></div>)
                                })}
                            </div>
                        </div>
                        <img onClick={() => {this.setState({preview: false})}} src="assets/cross.png" style={{position: "absolute", top: "5px", right: "10px", width: "28px", height: "28px", cursor: "pointer"}} alt="Close"/>
                    </div>}
                {this.state.displayLatex && <Latex handleLatexDisplay={this.handleLatexDisplay}/>}
            </div>
        )
    }
}

export default Match;