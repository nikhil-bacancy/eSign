import React, { Component } from "react";
import axios from "axios";
import { Form, FormGroup, Label, Col, Row, Button } from 'reactstrap';
import './recipient.css';
import { toastSuccess, toastError } from "../NotificationToast";

const baseUrl = process.env.REACT_APP_API_URL;
export default class DoSign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutPage: {
        pageId: null,
        pageTop: null,
        pageLeft: null,
        pageHeight: null,
        pageWidth: null
      },
      seletedRecipient: null,
      seletedRecipientsList: [],
      recipientList: [],
      selecteOptions: [],
      imagePreviewUrl: '',
      divPos: [],
      isDataStored: false,
      signPos: [],
      docId: 4,
      creatorId: 2,
      clientImageHeight: null,
      clientImageWidth: null,
      doc_signs_data: [],
    };
  }

  componentDidMount = () => {
    axios.get(`${baseUrl}/getRecipientList/`)
      .then((response) => {
        let { selecteOptions, recipientList } = this.state;
        recipientList = response.data.data
        selecteOptions = response.data.data.map(({ id, name }) => {
          let value = id;
          let label = name;
          let docSignId = null;
          return { value, label, docSignId };
        });
        this.setState({ recipientList, selecteOptions })
      })
      .catch((error) => {
        console.log(error);
      });
    this.onLoadPdf();
  }

  onLoadPdf = () => {
    axios.get(`${baseUrl}/getDoc/${this.state.docId}`)
      .then((response) => {
        if (response.data.data) {
          this.setState({ imagePreviewUrl: response.data.data })
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  formdataCoverter(payload) {
    let formdata = new FormData();
    for (let k in payload)
      formdata.append(k, payload[k]);
    return formdata;
  }

  handleChange = (selectedOption) => {
    let { seletedRecipient, doc_signs_data, seletedRecipientsList } = { ...this.state };
    seletedRecipient = selectedOption;
    let isFound = false;
    if (seletedRecipient) {
      if (doc_signs_data.length) {
        doc_signs_data.forEach(obj => { if (obj.recipientId === selectedOption.value) isFound = true })
        if (!isFound) {
          let statusId = 1, statusDate = Date.now();
          let documentId = this.state.docId, creatorId = this.state.creatorId, recipientId = selectedOption.value;
          doc_signs_data.push({ statusDate, statusId, creatorId, recipientId, documentId })
          seletedRecipientsList.push(selectedOption)
        }
      } else {
        let statusId = 1, statusDate = Date.now();
        let documentId = this.state.docId, creatorId = this.state.creatorId, recipientId = selectedOption.value;
        doc_signs_data.push({ statusDate, statusId, creatorId, recipientId, documentId })
        seletedRecipientsList.push(selectedOption)
      }
    }
    this.setState({ seletedRecipient, doc_signs_data, seletedRecipientsList });
  };

  onsetDocSign = () => {
    axios.post(`${baseUrl}/docsing/`, this.state.doc_signs_data)
      .then((response) => {
        toastSuccess(response.data.message)
        let { doc_signs_data, selecteOptions, seletedRecipient } = { ...this.state };
        doc_signs_data = response.data.data
        seletedRecipient = null
        selecteOptions = response.data.data.map((obj) => {
          let value = obj.recipient.id;
          let label = obj.recipient.name;
          let docSignId = obj.id;
          return { value, label, docSignId };
        });
        this.setState({ seletedRecipient, selecteOptions, doc_signs_data, isDataStored: true })
      })
      .catch((error) => {
        toastError(error.message)
      });
  }


  onDragOverCaptureImage = (event) => {
    let { aboutPage } = { ...this.state }
    aboutPage.pageId = event.target.id;
    aboutPage.pageTop = event.target.offsetTop;
    aboutPage.pageLeft = event.target.offsetLeft;
    aboutPage.pageHeight = event.target.height;
    aboutPage.pageWidth = event.target.width;
    this.setState({ aboutPage })
  }

  setImages = () => {
    return this.state.imagePreviewUrl.map((img, index) => <div key={index + 1} className='d-flex m-3 bg-secondary'><img width={"100%"} className={"pdfpage"} id={'pg-' + (index + 1)} onDragEnter={this.onDragOverCaptureImage} src={'http://192.168.1.49:8000/upload/' + img} alt={index + 1} /></div>);
  }

  getStyles = (left, top, ) => {
    return {
      position: 'absolute',
      left: left,
      top: top,
      cursor: 'move',
    }
  }
  renderSignOnPosition = () => {
    return [<div className="sign" style={this.getStyles("0px", "0px")}></div>, <div className="sign" style={this.getStyles("270px", "340px")}></div>]
  }

  render() {
    const { seletedRecipient, selecteOptions, imagePreviewUrl, isDataStored, } = this.state;
    return (
      <>
        <Form className='m-5' id='setsignForm'>
          <Row form>
            <Col md={12}>
              <center><Label size="lg" className='align text-primary text-uppercase'>- - - Do Sign On The Document - - -</Label></center>
            </Col>
          </Row>
          <Row form>
            {
              imagePreviewUrl.length &&

              <div className="signdocument flex-grow-1">
                {
                  this.renderSignOnPosition()
                }
                {
                  this.setImages()
                }
              </div>
            }
          </Row>
        </Form>
      </>
    );
  }
}

// onSendFile = () => {
//   const payload = {
//     pageNo: this.state.pageNumber - 1,
//     totalPages: this.state.numPages,
//     signX: this.state.signPos[0],
//     signY: this.state.signPos[1],
//     divX: this.state.divPos[0],
//     divY: this.state.divPos[1],
//     pdf: this.state.file,
//     sign: this.state.file2,
//   }
//   axios.post('http://192.168.1.49:8000/pdftohtml/', this.formdataCoverter(payload))
//     .then(function (response) {
//       console.log(response);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }

