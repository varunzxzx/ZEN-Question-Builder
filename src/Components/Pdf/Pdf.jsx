import React, { Component } from 'react';
class Pdf extends Component{
    constructor(props) {
        super(props);
        this.state = {
            display: true,
            src: "",
        }
    }

    handleChange = () => {
        this.setState({display: !this.state.display})
    }

    changeFile = () => {
        console.log("changing file now...")
        var preview = document.querySelector('#myIframe');
        var file    = document.querySelector('#fileInput').files[0];
        this.setState({file})
        // var reader  = new FileReader();
        // console.log(preview)
        // console.log(file)
        // console.log(reader)
        // let thiss = this;
        // reader.onloadend = function () {
        //     thiss.setState({src: reader.result})
        // }
 
        // if (file) {
        //     reader.readAsDataURL(file);
        // } else {
        //     preview.src = "";
        // }
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
        console.log("render - pdf")
        return(
            <div style={styles.container}>
            {/* <Document
                file={this.state.file}
                error={"fail to load"}>
            </Document> */}
                <iframe id="myIframe" style={styles.iframe} title="pdf" src={"http://projekty.wojtekmaj.pl/react-pdf/"} frameBorder="0" />
                {/* <div style={styles.change}>
                    <img onClick={this.handleChange} style={styles.img} src="assets/change.png" alt="Change"/>
                    <input id="fileInput" style={styles.input} type="file"/>
                </div> */}
            </div>
        )
    }
}

export default Pdf;