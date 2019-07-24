import React, { Component } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Draggable from 'react-draggable';
import sign from "./sign.png";
import axios from "axios";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
export default class App extends Component {
  state = {
    numPages: null, pageNumber: 1, file: '',
    imagePreviewUrl: '',
    divPos:[],
    signPos:[],
    file2:''
  };

  onSendFile = () => {
    const payload = {
      avatar: this.state.file,
      divX: this.state.divPos[0],
      divY: this.state.divPos[1],
      signX: this.state.signPos[0],
      signY: this.state.signPos[1],
      pageNo: this.setState.pageNumber
    }
    let formdata = new FormData();
    for (let k in payload) {
      if (k === "avatar") {
        formdata.append(k, payload[k], "name");
      } else {
        formdata.append(k, payload[k]);
      }
    }
    axios.post('http://localhost:8000/pdftohtml/', formdata)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  goToPrevPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber - 1 }));

  goToNextPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber + 1 }));

  handleChange(event) {
    // var tmppath = URL.createObjectURL(event.target.files[0]);
    this.setState({ file: event.target.files[0] })
  }

  handleChange2(event) {
    // var tmppath = URL.createObjectURL(event.target.files[0]);
    this.setState({ file2: event.target.files[0] })
  }


  getCords = () => {
    this.setState({
      divPos: this.getPositionXY(),
      signPos: this.getPositionXYSign()
    })
  }

  getPositionXY = (event) => { 
    var element = document.getElementById('docPage');
    var rect = element.getBoundingClientRect(); 
    document.getElementById('divpos').innerText = rect.x + ',' + rect.y 
    return [rect.x,rect.y];
  } 

  getPositionXYSign = (onStopEventXYvalue) => { 
    var element = document.getElementById('sign');
    var rect = element.getBoundingClientRect(); 
    document.getElementById('signpos').innerText = rect.x + ',' + rect.y 
    return [rect.x,rect.y]
  } 

  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div>
        1:<input type="file" onChange={(e) => this.handleChange(e)} /><br/><br/>
        2:<input type="file" onChange={(e) => this.handleChange2(e)} /><br/><br/>
        Div Position : <label id="divpos"></label><br/>
        Sign Position : <label id="signpos"></label><br/><br/>
        <nav>
          <button onClick={this.goToPrevPage}>Prev</button>
          <button onClick={this.goToNextPage}>Next</button>
        </nav><br/>
        <input type='button' value='Send File' onClick={this.onSendFile} /><br/><br/>
        <div id="docPage" style={{ width: 600 , border:'1px solid black' , background:'red', display: 'inline-block' }}>
          <Document
            file={this.state.file}
            onLoadSuccess={this.onDocumentLoadSuccess}
            onSourceSuccess={(e) => e && console.log(e)}
          >
            <Page  pageNumber={pageNumber} width={600} />
          </Document>
        </div>
        <div id="docPage1" style={{ width: 600 , border:'1px solid black' , background:'gray' , display: 'inline-block' }}>
          <Document
            file={this.state.file2}
            onLoadSuccess={this.onDocumentLoadSuccess}
            onSourceSuccess={(e) => e && console.log(e)}
          >
            <Page  pageNumber={pageNumber} width={600} />
          </Document>
        </div>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        <Draggable
          defaultPosition={{x: 0, y: 0}}
          // onStart={(val) => { console.log("onStart", val.target) }}
          // onDrag={(val) => { console.log("onDrag", val.target) }}
          onStop={this.getCords}>
          {/* <p id="sign">Click to Login</p> */}
          <img id="sign" src={sign} alt='' width='150' height='45' />
        </Draggable>
        <br />
      </div>
    );
  }
}



// getOffset = (el) => {
//   const rect = el.getBoundingClientRect();
//   return {
//     left: rect.left + window.scrollX,
//     right: rect.left + window.scrollX,
//     top: rect.top + window.scrollY,
//     bottom: rect.top + window.scrollY,
//   };
// }