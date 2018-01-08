import React, { Component } from 'react';
import Question from '../Question/Question';
import Option from '../Option/Option';
import Latex from '../Latex/Latex';
import axios from 'axios';
import autoComplete from '../auto-complete.min.js';
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
            options: [],
            nOptions: 0,
            displayLatex: false,
            question: "",
            optionsText: [],
            isLoading: false,
            success: false,
            type: 'mcq',
            preview: false,
            hints: [0],
            nHints: 1,
            hintsText: [""],
            Loading: true,
            questionList: [],
            solution: "",
            selected: {},
            id: 0,
            taglist: []
        }
    }

    handleLatexDisplay = () => {
        this.setState({displayLatex: !this.state.displayLatex})
    }

    handleHints = (e) => {
        this.setState({hints: e.target.value})
    }

    componentWillMount() {
        const thiss = this;
        axios({
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
                url: '/api/listtags',
                mode: 'cors',
                data: JSON.stringify({type: "mcq"})
            })
            .then(function (response) {
                thiss.setState({questionList: response.data, taglist: response.data.map(obj => obj.question), Loading: false},() => {
                    thiss.populate(0)
                })
            })
            .catch(function (error) {
                console.log(error)
                thiss.setState({Loading: false})
                alert("Something went wrong");
            });
    }

    populate = (i) => {
        let qImages = this.state.questionList[i].images;
        let oImages = this.state.questionList[i].questionAttrs[0].images;
        let question = this.state.questionList[i].question;
        let value = question
        while(value.indexOf("@@") !== -1) {
            let key = value[value.indexOf("@@")+2];
            let i=3;
            while(value[value.indexOf("@@")+i] !== '@') {
            key = key + value[value.indexOf("@@")+i];
            i++;
            }
            console.log(key)
            let img = value.replace(`@@${key}@@`,`<img class="question-img" style="width: 200px;" src="${qImages[key]}" alt="Image">`)
            value = img;
        }
        question = value.replace(/##61##/g,"=");

        let options = [];
        let optionsText = [];
        let nOptions = 0
        this.state.questionList[i].questionAttrs[0].options.map((option,i) => {
            options.push(i);
            value = option
            while(value.indexOf("@@") !== -1) {
                let key = value[value.indexOf("@@")+2];
                let i=3;
                while(value[value.indexOf("@@")+i] !== '@') {
                key = key + value[value.indexOf("@@")+i];
                i++;
                }
                console.log(key)
                let img = value.replace(`@@${key}@@`,`<img class="question-img" style="width: 200px;" src="${oImages[key]}" alt="Image">`)
                value = img;
            }
            option = value.replace(/##61##/g,"=")
            optionsText.push(option)
            nOptions++;
        })
        let hints = [];
        let hintsText = [];
        let nHints = 0
        if(this.state.questionList[i].hints) {
            this.state.questionList[i].hints.map((option,i) => {
                hints.push(i);
                value = option
                while(value.indexOf("@@") !== -1) {
                    let key = value[value.indexOf("@@")+2];
                    let i=3;
                    while(value[value.indexOf("@@")+i] !== '@') {
                    key = key + value[value.indexOf("@@")+i];
                    i++;
                    }
                    console.log(key)
                    let img = value.replace(`@@${key}@@`,`<img class="question-img" style="width: 200px;" src="${qImages[key]}"" alt="Image">`)
                    value = img;
                }
                option = value.replace(/##61##/g,"=")
                hintsText.push(option)
                nHints++;
            })
        }
        if(hintsText.length === 0) {
            hintsText = [""]
            hints = [0]
        }
        let solution = this.state.questionList[i].questionAttrs[0].solution || "";
        this.props.handleTags(this.state.questionList[i].tags.map(obj => obj.tag))
        let checked = this.state.questionList[i].questionAttrs[0].correct.map(correct => parseInt(correct))
        let id = this.state.questionList[i].id
        let selected = {
            question,
            options,
            optionsText,
            nOptions,
            hints,
            hintsText,
            nHints,
            checked,
            id
        }
        this.setState({
            question,
            options,
            optionsText,
            nOptions,
            hints,
            hintsText,
            nHints,
            selected,
            checked,
            id
        })
    }

    reInit = () => {
        // this.setState({
        //     checked: [],
        //     options: [0,1,2,3],
        //     nOptions: 4,
        //     displayLatex: false,
        //     question: "",
        //     optionsText: ["","","",""],
        //     isLoading: false,
        //     success: false,
        //     type: 'mcq',
        //     preview: false,
        //     hints: [0],
        //     nHints: 1,
        //     hintsText: [""],
        //     solution: ""
        // })
        // this.props.reInit()
        location.reload()
    }

    submit = () => {
        console.log("updating...")
        if(!this.state.checked || !this.state.question || !this.state.optionsText) {
            alert("Fields missing")
        } else {
            const correct = []
            let question = this.state.question;
            let images = {};
            let imgN = 0;
            let id = this.state.selected.id
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

            let imagesAns = {}
            let imgAnsN = 0

            question = question.replace(/&nbsp;/g," ")
            question = question.replace(/=/g,"##61##")
            question = question.replace(/&gt;/g,">")
            question = question.replace(/&lt;/g,"<")
            question = question.replace(/&amp;/g,"and")
            let solution = this.state.solution
            if(solution) {
                while(solution.indexOf("<img") !== -1) {
                    let start = solution.indexOf("<img");
                    let end = solution.indexOf("\">")
                    console.log(start)
                    console.log(end)
                    console.log(solution.substring(start,end+2))
    
                    let src = "",ch = solution.substring(solution.indexOf("src=\"")+5,solution.indexOf("src=\"")+6);
                    console.log(`ch= ${ch}`)
                    let i = 5;
                    while(ch !== "\"") {
                        src = src + ch;
                        i++;
                        ch = solution.substring(solution.indexOf("src=\"")+i,solution.indexOf("src=\"")+i+1);
                    }
                    console.log(src)
    
                    imagesAns[imgAnsN] = src;
                    solution = solution.replace(solution.substring(start,end+2),`@@${imgAnsN}@@`)
                    imgAnsN++;
                    console.log(solution)
                }
    
                solution = solution.replace(/&nbsp;/g," ")
                solution = solution.replace(/=/g,"##61##")
                solution = solution.replace(/&gt;/g,">")
                solution = solution.replace(/&lt;/g,"<")
                solution = solution.replace(/&amp;/g,"and")
            }

            let options = this.state.optionsText;
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
                option = option.replace(/&gt;/g,">")
                option = option.replace(/&amp;/g,"and")
                return option.replace(/&lt;/g,"<")
            })
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
                    question_id: id,
                    type: this.state.type,
                    options: OPTIONS,
                    correct: correct,
                    tags: this.props.tags,
                    images: images,
                    imagesAns: imagesAns,
                    hints: HINTS.length === 0?null : HINTS,
                    solution: solution || null
                }
            axios({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                    url: '/api/update',
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

    handleHints = (model,e) => {
        let tmpOptions = this.state.hints;
        let i = tmpOptions.indexOf(parseInt(e,10));
        let tmpOptionsText = this.state.hintsText;
        tmpOptionsText[i] = model;
        this.setState({hintsText: tmpOptionsText})
    }

    handleTextChange = (model) => {
        this.setState({question: model})
    }

    addOption = () => {
        // let builder = document.querySelector('#builder');        
        let tmpOptions = this.state.options;
        let tmpNOptions = this.state.nOptions;
        tmpNOptions++;
        tmpOptions.push(tmpNOptions);
        let tmpOptionsText = this.state.optionsText;
        tmpOptionsText.push("");
        this.setState({options: tmpOptions, nOptions: tmpNOptions,optionsText: tmpOptionsText},() => {
            // builder.scrollTop = builder.scrollHeight;
        });
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

    handleCheck = (i) => {
        let tmpChecked = this.state.checked;
        if(tmpChecked.indexOf(i) === -1) {
            tmpChecked.push(i);
        } else {
            tmpChecked.splice(tmpChecked.indexOf(i),1);
        }
        this.setState({checked: tmpChecked});
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
        let taglist = this.state.taglist;
        console.log(taglist)
        console.log("Builder updated..")
        const navigate = (e) => {
            console.log(e)
            for(let i=0; i<this.state.questionList.length; i++) {
                let question = this.state.questionList[i].question
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
                }
                question = question.replace(/&nbsp;/g," ")
                question = question.replace(/=/g,"##61##")
                question = question.replace(/&gt;/g,">")
                question = question.replace(/&lt;/g,"<")
                question = question.replace(/&amp;/g,"and")
                question = question.toLowerCase()
                console.log(question)
                if(question === e) {
                    this.populate(i)
                    break;
                }
            }
        }
        new autoComplete({
            selector: '#hero',
            minChars: 1,
            source: function(term, suggest){
                term = term.toLowerCase();
                var choices = taglist;
                var suggestions = [];
                for (let i=0;i<choices.length;i++)
                    if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
                suggest(suggestions);
            },
            onSelect: (event, term, item) => {
                term = term.toLowerCase()
                if(event.key !== "Enter") {
                    document.querySelector('#hero').value = "";
                    let elements = document.querySelectorAll('.autocomplete-suggestion')
                    navigate(term)
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
            }
        })
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
                <div>
                    <input id="hero" type="text" name="q" placeholder="Search questions..." />
                </div>
                { !this.state.Loading && <div>
                    <Question model={this.state.question} handleLatexDisplay={this.handleLatexDisplay} handleTextChange={this.handleTextChange}/>
                <h3 style={{padding: "10px", background: "#388287", margin: "0", color: "white"}}>Choices</h3>
                {this.state.options.map((key,i) => (
                    <Option model={this.state.optionsText[i]} handleOptions={this.handleOptions} handleLatexDisplay={this.handleLatexDisplay} addOption={this.addOption} handleCheck={this.handleCheck} checked={this.state.checked} removeOption={this.removeOption} num={i+1} i={key} key={key}/>
                ))}
                <h3 style={{padding: "10px", background: "#388287", margin: "0", color: "white"}}>Hints</h3>
                {this.state.hints.map((key,i) => (
                    <Option model={this.state.hintsText[i]} handleOptions={this.handleHints} handleLatexDisplay={this.handleLatexDisplay} addOption={this.addHint} handleCheck={this.handleCheck} checked={[]} removeOption={this.removeHint} num={i+1} i={key} key={i}/>
                ))}
                <h3 style={{padding: "10px", background: "#388287", margin: "0", color: "white"}}>Solution</h3>
                <Question off={true} model={this.state.solution} handleLatexDisplay={this.handleLatexDisplay} handleTextChange={(m) => {this.setState({solution: m})}}/>
                <div>
                    <div className="preview" onClick={this.preview}>PREVIEW</div>
                </div>
                    </div>}
                {this.state.preview && <div className="preview-display">
                        <div style={{textAlign: "center"}}><b>Question</b></div>
                        <div className="question"><InlineTex texContent={this.state.question}/></div>
                        <div style={{textAlign: "center"}}><b>Options</b></div>
                        {this.state.optionsText.map((option,i) => {
                            return (<div key={i} className={`option${i}`}><b>{i+1}.</b> <InlineTex texContent={option}/></div>)
                        })}
                        <img onClick={() => {this.setState({preview: false})}} src="assets/cross.png" style={{position: "absolute", top: "5px", right: "10px", width: "28px", height: "28px", cursor: "pointer"}} alt="Close"/>
                        <div>
                            <div onClick={this.submit} className="submit" disabled>{this.state.isLoading?"WAIT" : "UPDATE"}</div>
                        </div>
                    </div>}
                {this.state.displayLatex && <Latex handleLatexDisplay={this.handleLatexDisplay}/>}
            </div>
        )
    }
}

export default MCQ;