import React, { Component } from "react";
import axios from "axios";
import { withRouter } from 'react-router-dom';

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sender: {
        name: 'nikhil',
        email: 'nikhil.patel@bacancytechnology.com',
        docFile: '',
      }
    };
  }


  formdataCoverter = (payload) => {
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
    const { history } = this.props;
    const payload = {
      senderName: this.state.sender.name,
      senderEmail: this.state.sender.email,
      docFile: this.state.sender.docFile,
    }
    if (payload.docFile) {
      axios.post('http://localhost:8000/uploadfile/', this.formdataCoverter(payload))
        .then(() => {
          history.push(`setsign`)
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  handleChange = (event) => {
    let sender = { ...this.state.sender }
    sender.docFile = event.target.files[0];
    this.setState({ sender })
  }

  render() {
    return (
      <div>
        <center><h1>--------------------- UPLOAD YOUR DOCUMENT ---------------------</h1>
        <input type="file" onChange={(e) => this.handleChange(e)} />
        <input type='button' value='Upload File' onClick={this.onuploadFile} /><br /><br />
        </center>
      </div>
    );
  }
}

export default withRouter(FileUpload);