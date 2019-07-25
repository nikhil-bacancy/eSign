import React, { Component } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Draggable from 'react-draggable';
import sign from "./sign.png";
import axios from "axios";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      numPages: null, pageNumber: 1, file: '', file2:'', levels : 0,
      imagePreviewUrl: '',
      divPos:[],
      signPos:[],
      sender : {
        name: 'nikhil',
        email: 'nikhil.patel@bacancytechnology.com',
        docFile: '',
      }
    };
  }

  formdataCoverter (payload) {
    let formdata = new FormData();
    for (let k in payload) {
      if (k === "pdf" || k === 'sign' || k === 'docFile') {
        formdata.append(k, payload[k], k);
      } else {
        formdata.append(k, payload[k]);
      }
    }
    return formdata;
  }

  onuploadFile = () => {
    const payload = {
      senderName: this.state.sender.name,
      senderEmail: this.state.sender.email,
      docFile: this.state.sender.docFile,
    }
    if(payload.docFile){
      axios.post('http://localhost:8000/uploadfile/', this.formdataCoverter(payload))
      .then((response) => {
        this.setState({ levels : 1})
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  onSendFile = () => {
    const payload = {
      pageNo: this.state.pageNumber - 1,
      totalPages: this.state.numPages,
      signX: this.state.signPos[0],
      signY: this.state.signPos[1],
      divX: this.state.divPos[0],
      divY: this.state.divPos[1],
      pdf: this.state.file,
      sign: this.state.file2,
    }
    let formdata = new FormData();
    for (let k in payload) {
      if (k === "pdf" || k === 'sign') {
        formdata.append(k, payload[k], k);
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
    let sender = this.state.sender
    sender.docFile = event.target.files[0];
    this.setState({ file: event.target.files[0], sender })
  }

  handleChange2(event) {
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
    const { pageNumber, numPages,levels } = this.state;

    return (
      <div>
        {
          levels === 0 ? 
              <>
               1:<input type="file" onChange={(e) => this.handleChange(e)} />
                  <input type='button' value='Upload File' onClick={this.onuploadFile} /><br/><br/>
                {/* 2:<input type="file" onChange={(e) => this.handleChange2(e)} /><br/><br/> */}
              </>
          :
          <>
            Div Position : <label id="divpos"></label><br/>
            Sign Position : <label id="signpos"></label><br/><br/>
            <nav>
              <button onClick={this.goToPrevPage}>Prev</button>
              <button onClick={this.goToNextPage}>Next</button>
            </nav><br/>
            <p> Page {pageNumber} of {numPages} </p> <br />
            <input type='button' value='Send File' onClick={this.onSendFile} /><br/><br/>
          
            <Draggable defaultPosition={{x: 0, y: 0}} onStop={this.getCords}>
              <img id="sign" src={sign} alt='' width='150' height='45' />
            </Draggable><br/>
            <div id="docPage" style={{ width: 600 , border:'1px solid black' , background:'red', display: 'inline-block' }}>
              <Document
                file={this.state.file}
                renderMode={'svg'}
                onLoadSuccess={this.onDocumentLoadSuccess}
                onSourceSuccess={(e) => e && console.log(e)}
              >
                <Page  pageNumber={pageNumber} width={600} />
                <Page  pageNumber={2} width={600} />
              </Document>
            </div>
          </>
        }
      </div>
    );
  }
}

