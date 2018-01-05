import React, { Component } from 'react';
import axios from 'axios';
class Pdf extends Component{
    constructor(props) {
        super(props);
        this.state = {
            display: false,
            src: "uploads/Arihant Physics electrostatics.pdf",
        }
    }

    handleChange = () => {
        this.setState({display: !this.state.display})
    }

    changeFile = () => {
        const thiss = this;
        console.log("changing file now...")
        var preview = document.querySelector('#myIframe');
        var file    = document.querySelector('#fileInput').files[0];
        var formData = new FormData();
        formData.append("pdf", file);
        axios.post('api/upload_file', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
        .then(function (response) {
            console.log(response.data)
            thiss.setState({src: response.data.file})
        })
        .catch(function (error) {
            console.log("error");
        });
    }

    handlePdf = (e) => {
        this.setState({src: e.target.value})
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
                <iframe id="myIframe" style={styles.iframe} title="pdf" src={this.state.src} frameBorder="0" />
                <div style={styles.change}>
                    <img id="change" onClick={this.handleChange} style={styles.img} src="assets/change.png" alt="Change"/>
                    <input id="fileInput" onChange={this.changeFile} style={styles.input} type="file"/>
                    <select value={this.state.src} onChange={this.handlePdf} style={styles.input} name="file-name" id="">
                        <option value="uploads/Arihant Physics electrostatics.pdf">Arihant Physics electrostatics</option>
                        <option value="uploads/Fundamentals of Physics.pdf">Fundamentals of Physics</option>
                    </select>
                </div>
            </div>
        )
    }
}

export default Pdf;