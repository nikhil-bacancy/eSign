import React, { Component } from "react";
import axios from "axios";

export default class SetSign extends Component {
    constructor(props) {
      super(props);
      this.state = {
        numPages: null, pageNumber: 1, file: '', file2: '',
        imagePreviewUrl: '',
        divPos: [],
        signPos: [],
        sender: {
          name: 'nikhil',
          email: 'nikhil.patel@bacancytechnology.com',
          docFile: '',
        }
      };
    }
  
    formdataCoverter(payload) {
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
      if (payload.docFile) {
        axios.post('http://localhost:8000/uploadfile/', this.formdataCoverter(payload))
          .then((response) => {
            this.setState({ levels: 1 })
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
      return [rect.x, rect.y];
    }
  
    getPositionXYSign = (onStopEventXYvalue) => {
      var element = document.getElementById('sign');
      var rect = element.getBoundingClientRect();
      document.getElementById('signpos').innerText = rect.x + ',' + rect.y
      return [rect.x, rect.y]
    }
  
    render() {
      const { pageNumber, numPages } = this.state;
  
      return (
        <div>
  
            Div Position : <label id="divpos"></label><br />
            Sign Position : <label id="signpos"></label><br /><br />

            <p> Page {pageNumber} of {numPages} </p> <br />
            <input type='button' value='Send File' onClick={this.onSendFile} /><br /><br />

            <div id="docPage" style={{ width: 600, border: '1px solid black', background: 'red', display: 'inline-block' }}>

            </div>
          
        </div>
      );
    }
  }
  
  

