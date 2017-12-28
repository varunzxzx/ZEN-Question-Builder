import React, { Component } from 'react';
import autoComplete from './auto-complete.min.js';
import MCQ from './MCQ/MCQ';
import ShortAnswer from './ShortAnswer/ShortAnswer'
import Match from './Match/Match';
import axios from 'axios';

class Builder extends Component{
    constructor(props) {
        super(props);
        this.state = {
            types: ["MCQ","Short Answer","Match the Following"],
            src: "",
            tags: [],
            taglist: [],
            selectedType: "MCQ",
            loading: true
        }
    }

    componentWillMount() {
        const thiss = this;
        axios({
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
                url: '/api/getTags',
                mode: 'cors'
            })
            .then(function (response) {
                let tmpTags = []
                for(let key in response.data.tags) {
                    tmpTags.push(response.data.tags[key].tag)
                }
                console.log("fetched")
                thiss.setState({taglist: tmpTags, loading: false});
            })
            .catch(function (error) {
                console.log("error");
            });
    }

    handleType = (e) => {
        this.setState({selectedType: e.target.value})
    }

    handleAppend(term) {
        let tmp = this.state.tags;
        if(tmp.indexOf(term) === -1) {
            tmp.push(term);
            this.setState({tags: tmp});
        }
    }

    componentDidUpdate() {
        let taglist = this.state.taglist;
        new autoComplete({
            selector: '#hero-demo',
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
                this.handleAppend(term);
                if(event.key !== "Enter") {
                    document.querySelector('#hero-demo').value = "";
                    let element = document.querySelector('.autocomplete-suggestion.selected.selected')
                    element.parentNode.removeChild(element);                    
                }
            }
        })
    }

    handleNew = (e) => {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code === 13) {
            let tmp = this.state.taglist;
            e.target.value = e.target.value.toLowerCase()
            if(tmp.indexOf(e.target.value) === -1) {
                tmp.push(e.target.value);
                this.setState({taglist: tmp});
                this.handleAppend(e.target.value);
            }
            document.querySelector('#hero-demo').value = "";
        }
    }

    remove = (e) => {
        const char = (e.currentTarget).getAttribute('data-id');
        let tmp = this.state.tags;
        tmp.splice(tmp.indexOf(char),1);
        this.setState({tags: tmp});
    }

    render() {
        return(
            <div>
                {!this.state.loading && <div>
                    <div id="top">
                    <select onChange={this.handleType} name="type" id="type">
                        {this.state.types.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <div id="tags">
                        Tags:&nbsp;&nbsp;
                        <input id="hero-demo" onKeyPress={(e) => {this.handleNew(e)}} autoFocus type="text" name="q" placeholder="Type here...." />
                    </div>
                </div>
                <ul id="taglist" style={{display: this.state.tags.length ? "block" : "none"}}>
                            {this.state.tags.map(tag => (
                                <li style={{cursor: "pointer"}} onDoubleClick={this.remove} ref={li => {this[tag] = li}} data-id={tag} key={tag}>{tag}</li>
                            ))}
                </ul>
                {this.state.selectedType === "MCQ" && <MCQ tags={this.state.tags}/>}
                {this.state.selectedType === "Short Answer" && <ShortAnswer tags={this.state.tags}/>}
                {this.state.selectedType === "Match the Following" && <Match tags={this.state.tags}/>}
                </div>
                }
            </div>
        )
    }
}

export default Builder;