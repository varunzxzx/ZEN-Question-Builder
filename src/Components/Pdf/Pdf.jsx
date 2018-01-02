import React, { Component } from 'react';

class Pdf extends Component{
    constructor(props) {
        super(props);
        this.state = {
            display: true,
            src: "https://imlearner.files.wordpress.com/2010/08/computer-system-architecture-3rd-ed-morris-mano-p98.pdf",
        }
        console.log("constructor - pdf")
    }

    componentDidMount() {
        console.log("component mounted")
        let input = document.querySelector('#file-input');
        input.addEventListener('change',this.mjelo)
    }

    componentDidUpdate() {
        console.log("component updated")
        let input = document.querySelector('#file-input');
        input.addEventListener('change',this.mjelo)
    }

    componentWillUnmount() {
        console.log("component unmounted")
        let input = document.querySelector('#file-input');
        input.removeEventListener('change',this.mjelo)
    }

    mjelo = (e) => {
        window.alert(e.target.value);
    }

    handleChange = () => {
        this.setState({display: !this.state.display})
    }

    changeFile = () => {
        console.log("changing file now...")
        var preview = document.querySelector('#iframe');
        var file    = document.querySelector('#file-input').files[0];
        var reader  = new FileReader();
        console.log(preview)
        console.log(file)
        console.log(reader)
        reader.onloadend = function () {
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
        console.log("render - pdf")
        return(
            <div style={styles.container}>
                <iframe id="iframe" style={styles.iframe} title="pdf" src={this.state.src} frameBorder="0"></iframe>
                <div style={styles.change}>
                    <img id="change" onClick={this.handleChange} style={styles.img} src="assets/change.png" alt="Change"/>
                    <input id="file-input" style={styles.input} type="file" onChange={this.changeFile}/>
                </div>
            </div>
        )
    }
}

export default Pdf;