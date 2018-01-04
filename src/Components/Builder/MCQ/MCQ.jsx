import React, { Component } from 'react';
import Question from '../Question/Question';
import Option from '../Option/Option';
import Latex from '../Latex/Latex';
import axios from 'axios';
import {InlineTex} from 'react-tex';
const isEmpty = (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
class MCQ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: [],
            options: [0,1,2,3],
            nOptions: 4,
            displayLatex: false,
            question: "",
            optionsText: ["","","",""],
            isLoading: false,
            success: false,
            type: 'mcq',
            preview: false,
            converted: ""
        }
    }

    handleLatexDisplay = () => {
        this.setState({displayLatex: !this.state.displayLatex})
    }

    reInit = () => {
        this.setState({
            checked: [],
            options: [0,1,2,3],
            nOptions: 4,
            displayLatex: false,
            question: "",
            optionsText: ["","","",""],
            isLoading: false,
            success: false,
            type: 'mcq',
            preview: false,
            converted: ""
        })
        this.props.reInit()
    }

    submit = () => {
        if(!this.state.checked || !this.state.question || !this.state.optionsText) {
            alert("Fields missing")
        } else {
            const correct = []
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
            let options = this.state.optionsText;
            let imagesAns = {}
            let imgAnsN = 0
            let OPTIONS = options.map((option,i) => {
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
            
            this.state.checked.map((checked,i) => {
                if(this.state.options.indexOf(checked) !== -1) {
                    correct.push(this.state.options.indexOf(checked))
                }
            })
            console.log(OPTIONS)
            console.log(images)
            if(!this.state.isLoading) {
                const thiss = this;
                this.setState({isLoading: true})
                const payload = {
                    question: question,
                    type: this.state.type,
                    options: OPTIONS,
                    correct: correct,
                    tags: this.props.tags,
                    images: images,
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
                    console.log(error)
                    thiss.setState({isLoading: false})
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
                {this.state.optionsText.map((option,i) => {
                    // document.querySelector(`.option${i}`).innerHTML = `<b>${i+1}.</b>${option}`
                })}
            })
        }
    }

    removeWrapper = () => {
        var elements = document.querySelectorAll("a[target='_blank'");
        console.log("run..")
        if(!isEmpty(elements)) {
            for (let key in elements) {
                try {
                    elements[key].parentNode.removeChild(elements[key]);
                } catch(err) {
                    // do nothing
                }
            }
        }
    }

    componentDidMount() {
        this.removeWrapper()
    }

    componentDidUpdate() {
        this.removeWrapper()
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
                <Question model={this.state.question} handleLatexDisplay={this.handleLatexDisplay} handleTextChange={this.handleTextChange}/>
                <h3 style={{padding: "10px", background: "#388287", margin: "0", color: "white"}}>Choices</h3>
                {this.state.options.map((key,i) => (
                    <Option model={this.state.optionsText[i]} handleOptions={this.handleOptions} handleLatexDisplay={this.handleLatexDisplay} addOption={this.addOption} handleCheck={this.handleCheck} checked={this.state.checked} removeOption={this.removeOption} num={i+1} i={key} key={key}/>
                ))}
                <div>
                    <div className="preview" onClick={this.preview}>PREVIEW</div>
                </div>
                {this.state.preview && <div className="preview-display">
                        <div style={{textAlign: "center"}}><b>Question</b></div>
                        <div className="question"><InlineTex texContent={this.state.question}/></div>
                        <div style={{textAlign: "center"}}><b>Options</b></div>
                        {this.state.optionsText.map((option,i) => {
                            return (<div key={i} className={`option${i}`}><b>{i+1}.</b> <InlineTex texContent={option}/></div>)
                        })}
                        <img onClick={() => {this.setState({preview: false})}} src="assets/cross.png" style={{position: "absolute", top: "5px", right: "10px", width: "28px", height: "28px", cursor: "pointer"}} alt="Close"/>
                        <div>
                            <div onClick={this.submit} className="submit" disabled>{this.state.isLoading?"WAIT" : "SUBMIT"}</div>
                        </div>
                    </div>}
                {this.state.displayLatex && <Latex handleLatexDisplay={this.handleLatexDisplay}/>}
            </div>
        )
    }
}

export default MCQ;