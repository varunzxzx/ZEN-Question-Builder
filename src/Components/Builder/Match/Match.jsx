import React, { Component } from 'react';
import Question from '../Question/Question';
import Option from '../Option/Option';
import Latex from '../Latex/Latex';
import axios from 'axios';
import {InlineTex} from 'react-tex';

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
            isLoading: false,
            type: "match",
            preview: false
        }
    }

    reInit = () => {
        this.setState({
            displayLatex: false,
            column1: [0,1,2],
            nCol1:3,
            column2: [0,1,2],
            nCol2: 3,
            question: "",
            col1Text: ["","",""],
            col2Text: ["","",""],
            answers: {},
            isLoading: false,
            type: "match",
            preview: false
        })
    }

    submit = () => {
        if(!this.state.col1Text[0] || !this.state.question || !this.state.col2Text[0] || isEmpty(this.state.answers)) {
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
            question = question.replace(/&gt;/g,"##62##")
            question = question.replace(/&lt;/g,"##63##")
            let imagesAns = {}
            let imgAnsN = 0
            let col1Text = this.state.col1Text;
            let COL1TEXT = col1Text.map((option,i) => {
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
                    
                    imagesAns[imgAnsN] = src;
                    option = option.replace(option.substring(start,end+2),`@@${imgAnsN}@@`)
                    imgAnsN++;
                    console.log(option)
                }
                option = option.replace(/&nbsp;/g," ")
                option = option.replace(/=/g,"##61##")
                option = option.replace(/&gt;/g,"##62##")
                return option.replace(/&lt;/g,"##63##")
            })
            let col2Text = this.state.col2Text;
            let COL2TEXT = col2Text.map((option,i) => {
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
                    
                    imagesAns[imgAnsN] = src;
                    option = option.replace(option.substring(start,end+2),`@@${imgAnsN}@@`)
                    imgAnsN++;
                    console.log(option)
                }
                option = option.replace(/&nbsp;/g," ")
                option = option.replace(/=/g,"##61##")
                option = option.replace(/&gt;/g,"##62##")
                return option.replace(/&lt;/g,"##63##")
            })
            console.log("Question: " + question);
            console.log("Column 1")
            COL1TEXT.map(col => {
                console.log(col)
            })
            console.log("Column 2")
            COL2TEXT.map(col => {
                console.log(col)
            })
            console.log(this.state.answers)
            if(!this.state.isLoading) {
                const thiss = this;
                this.setState({isLoading: true})
                const payload = {
                    question: question,
                    type: this.state.type,
                    col1: COL1TEXT,
                    col2: COL2TEXT,
                    tags: this.props.tags,
                    images: images,
                    matchAnswer: this.state.answers,
                    imagesAns: imagesAns
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
                    thiss.reInit()
                })
                .catch(function (error) {
                    thiss.setState({isLoading: false})
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
                {this.state.col1Text.map((option,i) => {
                    // document.querySelector(`.col1${i}`).innerHTML = `<b>${alpha(i+1)}.</b>${option}`
                })}
                {this.state.col2Text.map((option,i) => {
                    // document.querySelector(`.col2${i}`).innerHTML = `<b>${i+1}.</b>${option}`
                })}
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

    componentWillUnmount() {
        clearInterval(this.state.id)
    }

    // componentDidUpdate() {
    //     this.removeWrapper();
    // }

    // componentDidMount() {
    //     this.removeWrapper();
    // }

    render() {
        return(
            <div>
                <Question model={this.state.question}  handleLatexDisplay={this.handleLatexDisplay} handleTextChange={this.handleTextChange}/>
                <div className="cols">
                    <div className="col1">
                    {this.state.column1.map((key,i) => (
                        <Option model={this.state.col1Text[i]} num={i+1} handleOptions={this.handleCol1} col={21} handleLatexDisplay={this.handleLatexDisplay} addOption={this.addOption} handleCheck={this.handleCheck} checked={[]} removeOption={this.removeOption} i={key} key={key}/>
                    ))}
                    </div>
                    <div className="col2">
                    {this.state.column2.map((key,i) => (
                        <Option model={this.state.col2Text[i]} num={i+1} showNum={true} handleOptions={this.handleCol2} col={21} handleLatexDisplay={this.handleLatexDisplay} addOption={this.addColumn2} handleCheck={this.handleCheck} checked={[]} removeOption={this.removeColumn2} i={key} key={key}/>
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
                    <div onClick={this.preview} className="preview">PREVIEW</div>
                </div>
                {this.state.preview && <div className="preview-display">
                        <div style={{textAlign: "center"}}><b>Question</b></div>
                        <div className="question"><InlineTex texContent={this.state.question}/></div>
                        <div style={{textAlign: "center"}}><b>Options</b></div>
                        <div className="cols">
                            <div className="col1">
                                {this.state.col1Text.map((option,i) => {
                                    return (<div key={i} className={`col1${i}`}><b>{alpha(i+1)}.</b> <InlineTex texContent={option}/></div>)
                                })}
                            </div>
                            <div className="col2">
                                {this.state.col2Text.map((option,i) => {
                                    return (<div key={i} className={`col2${i}`}><b>{i+1}.</b><InlineTex texContent={option}/></div>)
                                })}
                            </div>
                        </div>
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

export default Match;