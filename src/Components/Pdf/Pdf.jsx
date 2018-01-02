import React, { Component } from 'react';

class Pdf extends Component{
    constructor(props) {
        super(props);
        this.state = {
            display: true,
            src: "https://imlearner.files.wordpress.com/2010/08/computer-system-architecture-3rd-ed-morris-mano-p98.pdf",
        }
    }

    handleChange = () => {
        this.setState({display: !this.state.display})
    }

    changeFile = () => {
        var preview = document.querySelector('#iframe');
        var file    = document.querySelector('input[type=file]').files[0];
        var reader  = new FileReader();
 
        reader.onloadend = function () {
            console.log(reader.result)
            preview.src = reader.result;
        }
 
        if (file) {
            reader.readAsDataURL(file);
        } else {
            preview.src = "";
        }
    }

    render() {
        const styles = {
            container: {
                position: "relative",
            },
            iframe: {
                width: "100%",
                height: "100vh",
            },
            change: {
                position: "absolute",
                top: 70,
                left: 20,
            },
            img: {
                width: "28px",
                height: "28px",
            },
            input: {
                display: this.state.display?"inline-block":"none",
                position: "relative",
                top: "-9px",
                left: "10px",
            },
        }
        return(
            <div style={styles.container}>
                <iframe id="iframe" style={styles.iframe} title="pdf" src={this.state.src} frameBorder="0"></iframe>
                <div style={styles.change}>
                    <img id="change" onClick={this.handleChange} style={styles.img} src="assets/change.png" alt="Change"/>
                    <input style={styles.input} type="file" onChange={(e) => {this.changeFile(e)}}/>
                </div>
            </div>
        )
    }
}

export default Pdf;