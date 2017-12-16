import React, { Component } from 'react';
import Builder from './Components/Builder/Builder';
import Pdf from './Components/Pdf/Pdf';
import ReactDOM from 'react-dom';
import './index.css';

class App extends Component {
  render() {
    const styles = {
      grid: {
        width: "50%",
        float: "left",
        background: "#F3E5F5",
        height: "100vh",
        overflowY: "auto"
      },
    }
    return (
      <div className="App">
          <div style={styles.grid} id="builder"><Builder /></div>
          <div style={styles.grid}><Pdf /></div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
