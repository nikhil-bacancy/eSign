import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import Dnd from "./dragNdrop/Dnd";
import { Form, FormGroup, Label, Col, Row, Button } from 'reactstrap';
import './App.css';

const baseUrl = process.env.REACT_APP_API_URL;
export default class SetSign extends Component {
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
      docId: 3,
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
          let documentId = this.state.docId, organizationId = 1, creatorId = 1, recipientId = selectedOption.value;
          doc_signs_data.push({ statusDate, statusId, organizationId, creatorId, recipientId, documentId })
          seletedRecipientsList.push(selectedOption)
        }
      } else {
        let statusId = 1, statusDate = Date.now();
        let documentId = this.state.docId, organizationId = 1, creatorId = 1, recipientId = selectedOption.value;
        doc_signs_data.push({ statusDate, statusId, organizationId, creatorId, recipientId, documentId })
        seletedRecipientsList.push(selectedOption)
      }
    }
    this.setState({ seletedRecipient, doc_signs_data, seletedRecipientsList });
  };

  onsetDocSign = () => {
    axios.post(`${baseUrl}/docsing/`, this.state.doc_signs_data)
      .then((response) => {
        let { doc_signs_data, selecteOptions, seletedRecipient } = { ...this.state };
        doc_signs_data = response.data.data
        seletedRecipient = null
        selecteOptions = response.data.data.map((obj, index) => {
          let value = selecteOptions[index].value;
          let label = selecteOptions[index].label;
          let docSignId = obj.id;
          return { value, label, docSignId };
        });
        this.setState({ seletedRecipient, selecteOptions, doc_signs_data, isDataStored: true })
      })
      .catch((error) => {
        console.log(error);
      });
  }


  onDragOverCaptureImage = (event) => {
    let { aboutPage } = { ...this.state }
    aboutPage.pageId = event.target.id;
    aboutPage.pageTop = event.target.offsetTop;
    aboutPage.pageLeft = event.target.offsetLeft;
    aboutPage.pageHeight = event.target.height;
    aboutPage.pageWidth = event.target.width;
    // console.log("TCL: onDragOverCaptureImage -> page top", event.target.offsetTop)
    // console.log("TCL: onDragOverCaptureImage -> page left", event.target.offsetLeft)
    // console.log("TCL: onDragOverCaptureImage -> event.target.height", event.target.height)
    // console.log("TCL: onDragOverCaptureImage -> event.target.width", event.target.width)
    // console.log("TCL: onDragOverCaptureImage -> event.target.naturalHeight", event.target.naturalHeight)
    // console.log("TCL: onDragOverCaptureImage -> event.target.naturalWidth", event.target.naturalWidth)
    this.setState({ aboutPage })
  }

  setImages = () => {
    return this.state.imagePreviewUrl.map((img, index) => <div key={index + 1} className='d-flex mt-3 bg-secondary'><img width={"100%"} className={"pdfpage"} id={'pg-' + (index + 1)} onDragEnter={this.onDragOverCaptureImage} src={'http://192.168.1.49:8000/upload/' + img} alt={index + 1} /></div>);
  }

  render() {
    const { seletedRecipient, selecteOptions, imagePreviewUrl, isDataStored } = this.state;
    return (
      <>
        <Form className='m-5' id='setsignForm'>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label>Select Recipient: </Label>
                <Select
                  isSearchable
                  value={seletedRecipient}
                  onChange={this.handleChange}
                  options={selecteOptions}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <Label>Selected Recipients : </Label>
              <FormGroup>
                {this.state.seletedRecipientsList.map((obj) => <Label id="divpos" key={obj.value} className={"pr-2 text-uppercase text-info"} size="md">{obj.label}</Label>)}
              </FormGroup>
            </Col>
            <Col md={3}>
              {!isDataStored &&
                <>
                  <FormGroup>
                    <Button onClick={this.onsetDocSign} color="primary"> Add Doc Sign Details </Button>
                  </FormGroup>
                </>
              }
            </Col>
          </Row>
          <Row form>
            {/* <Col md={6}>
              <Label>Selected Recipients : </Label>
              <FormGroup>
                {this.state.seletedRecipientsList.map((obj) => <Label id="divpos" key={obj.value} className={"pr-2 text-uppercase text-info"} size="md">{obj.label}</Label>)}
              </FormGroup>
            </Col> */}
          </Row>
          {/* <Button onClick={this.onSendFile} >Send File</Button> */}
          <Row form>
            <Col md={12}>
              <center><Label size="lg" className='align'> File Viewer</Label></center>
            </Col>
          </Row>
          <Row form>
            {
              imagePreviewUrl.length &&
              <Dnd pageDetails={this.state.aboutPage} doc_signs_data={this.state.doc_signs_data} seletedRecipient={this.state.seletedRecipient} setImages={this.setImages()} />
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

