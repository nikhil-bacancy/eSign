import React, { Component } from "react";
import axios from "axios";
import { withRouter } from 'react-router-dom';
import { toastError, toastSuccess } from '../NotificationToast';
const baseUrl = process.env.REACT_APP_API_URL;

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creator: {
        id: null,
        name: "nikhil patel",
        phoneNumber: "8866210229",
        email: "nikhil.patel@bacancytechnology.com",
        password: "nik13"
      },
      recipients: [
        {
          id: null,
          name: "hiren panchal",
          phoneNumber: "7894564645",
          email: "hiren.panchal@bacancytechnology.com",
        },
        {
          id: null,
          name: "shivangi bhatt",
          phoneNumber: "7894564645",
          email: "shivangi.bhatt@bacancytechnology.com",
        },
        {
          id: null,
          name: "komal kanada",
          phoneNumber: "7894564645",
          email: "komal.kanada@bacancytechnology.com",
        },
        {
          id: null,
          name: "Jn patel",
          phoneNumber: "9998453840",
          email: "nikhilpatel26195@gmail.com",
        }
      ],
      sender: {
        name: "nikhil",
        phoneNumber: "8866210229",
        email: "nikhil.patel@bacancytechnology.com",
        docFile: null,
        totalPages: null
      }
    };
  }


  formdataCoverter = (payload) => {
    let formdata = new FormData();
    for (let k in payload) {
      formdata.append(k, payload[k]);
    }
    return formdata;
  }

  onAddNewCreator = () => {
    if (this.state.creator.name) {
      axios.post(`${baseUrl}/creator/`, this.state.creator)
        .then((res) => {
          let { creator } = this.state
          creator.id = res.data.data.id
          this.setState({ creator })
          toastSuccess(res.data.message)
        })
        .catch((error) => {
          console.log(error);
          toastError(error.message)
        });
    }
  }

  onAddNewRecipients = () => {
    if (this.state.recipients.length) {
      axios.post(`${baseUrl}/recipients/`, this.state.recipients)
        .then((res) => {
          let { recipients } = this.state
          res.data.data.forEach((obj, index) => {
            recipients[index].id = obj.id
          });
          this.setState({ recipients })
          toastSuccess(res.data.message)
        })
        .catch((error) => {
          console.log(error);
          toastError(error.message)
        });
    }
  }

  onuploadFile = () => {
    const { history } = this.props;
    if (this.state.sender.docFile) {
      axios.post(`${baseUrl}/uploadfile/`, this.formdataCoverter(this.state.sender))
        .then((response) => {
          history.push({
            pathname: '/sender/setsign',
            search: '',
            state: { doc: response.data.data, creator: this.state.creator }
          })
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  handleChange = (event) => {
    let sender = { ...this.state.sender }
    let file = event.target.files[0];
    let reader = new FileReader();
    if (file.type === 'application/pdf') {
      sender.docFile = file;
      reader.readAsBinaryString(file);
      reader.onloadend = () => {
        sender.totalPages = reader.result.match(/\/Type[\s]*\/Page[^s]/g).length;
      }
    }
    this.setState({ sender })
  }

  render() {
    return (
      <div>
        <center>
          <h1>--------------------- ADD SENDER ---------------------</h1>
          <input type='button' value='add new sender' onClick={this.onAddNewCreator} /><br /><br />
          <h1>--------------------- ADD RECIPIENTS ---------------------</h1>
          <input type='button' value='add new recipients' onClick={this.onAddNewRecipients} /><br /><br />
          <h1>--------------------- UPLOAD YOUR DOCUMENT ---------------------</h1>
          <form encType="multipart/form-data">
            <input type="file" name="docFile" onChange={(e) => this.handleChange(e)} />
            <input type='button' value='Upload File' onClick={this.onuploadFile} /><br /><br />
          </form>
        </center>
      </div>
    );
  }
}

export default withRouter(FileUpload);