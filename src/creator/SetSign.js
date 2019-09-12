import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import Dnd from "../dragNdrop/Dnd";
import { withRouter } from 'react-router-dom';
import { Form, Input, FormGroup, Label, Col, Row, Button } from 'reactstrap';
import '../App.css';
import { toastSuccess, toastError } from "../NotificationToast";

const baseUrl = process.env.REACT_APP_API_URL;
class SetSign extends Component {
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
      sender: "nikhil.patel@bacancytechnology.com",
      seletedRecipient: null,
      currentRecipient: {},
      seletedRecipientsList: [],
      recipientList: [],
      selecteOptions: [],
      imagePreviewUrl: '',
      divPos: [],
      isDataStored: false,
      signPos: [],
      docId: null,
      creatorId: null,
      clientImageHeight: null,
      clientImageWidth: null,
      doc_signs_data: [],
    };
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    let { aboutPage } = { ...this.state }
    if (document.getElementById('pg-1')) {
      aboutPage.pageHeight = document.getElementById('pg-1').clientHeight;
      aboutPage.pageWidth = document.getElementById('pg-1').clientWidth;
      this.setState({ aboutPage })
    }
  }

  componentDidMount = () => {
    const { location } = this.props;
    window.addEventListener("resize", this.updateDimensions);
    let { selecteOptions, recipientList, docId, creatorId, sender } = this.state;
    axios.get(`${baseUrl}/getRecipientList/`)
      .then((response) => {
        recipientList = response.data.data
        docId = location.state.doc.id ? location.state.doc.id : docId;
        creatorId = location.state.creator.id ? location.state.creator.id : creatorId;
        sender = location.state.creator ? location.state.creator : sender;
        selecteOptions = response.data.data.map(({ id, name, email }) => {
          let value = id;
          let label = name;
          let docSignId = null;
          return { value, label, docSignId, email };
        });
        this.setState({ recipientList, selecteOptions, docId, creatorId, sender }, this.onLoadPdf(docId))
      })
      .catch((error) => {
        console.log(error);
      });

  }

  onLoadPdf = (docId) => {
    axios.get(`${baseUrl}/getDoc/${docId}`)
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

  // handleChange = (selectedOption) => {
  //   let { seletedRecipient, doc_signs_data, seletedRecipientsList } = { ...this.state };
  //   seletedRecipient = selectedOption;
  //   let isFound = false;
  //   if (seletedRecipient) {
  //     if (doc_signs_data.length) {
  //       doc_signs_data.forEach(obj => { if (obj.recipientId === selectedOption.value) isFound = true })
  //       if (!isFound) {
  //         let statusId = 1, statusDate = Date.now();
  //         let documentId = this.state.docId, creatorId = this.state.creatorId, recipientId = selectedOption.value;
  //         doc_signs_data.push({ statusDate, statusId, creatorId, recipientId, documentId })
  //         seletedRecipientsList.push(selectedOption)
  //       }
  //     } else {
  //       console.log("TCL: handleChange -> doc_signs_data", doc_signs_data)
  //       let statusId = 1, statusDate = Date.now();
  //       let documentId = this.state.docId, creatorId = this.state.creatorId, recipientId = selectedOption.value;
  //       doc_signs_data.push({ statusDate, statusId, creatorId, recipientId, documentId })
  //       seletedRecipientsList.push(selectedOption)
  //     }
  //   }
  //   this.setState({ seletedRecipient, doc_signs_data, seletedRecipientsList });
  // };


  handleChange = (selectedOption) => {
    let { seletedRecipient, doc_signs_data, docId, creatorId } = this.state;
    seletedRecipient = selectedOption;
    if (seletedRecipient) {
      doc_signs_data = selectedOption.map(({ value }) => {
        let documentId = docId, recipientId = value;
        let statusId = 1, statusDate = Date.now();
        return { documentId, creatorId, recipientId, statusId, statusDate };
      });
    } else {
      doc_signs_data = []
    }
    this.setState({ seletedRecipient, doc_signs_data });
  }

  onsetDocSign = () => {
    axios.post(`${baseUrl}/docsing/`, this.state.doc_signs_data)
      .then((response) => {
        let { doc_signs_data, selecteOptions, seletedRecipient, seletedRecipientsList } = { ...this.state };
        doc_signs_data = response.data.data
        seletedRecipient = null
        selecteOptions = response.data.data.map((obj) => {
          let value = obj.recipient.id;
          let label = obj.recipient.name;
          let docSignId = obj.id;
          let email = obj.recipient.email;
          return { value, label, docSignId, email };
        });
        seletedRecipientsList = selecteOptions;
        this.setState({ seletedRecipient, selecteOptions, doc_signs_data, isDataStored: true, seletedRecipientsList })
        toastSuccess(response.data.message)
      })
      .catch((error) => {
        console.log("TCL: onsetDocSign -> error.message", error.message)
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

  onPageLoad = (event) => {
    let { aboutPage } = { ...this.state }
    aboutPage.pageId = event.target.id;
    aboutPage.pageTop = event.target.offsetTop;
    aboutPage.pageLeft = event.target.offsetLeft;
    aboutPage.pageHeight = event.target.height;
    aboutPage.pageWidth = event.target.width;
    this.setState({ aboutPage })
  }

  onCheckedChange = (event) => {
    let { currentRecipient } = { ...this.state }
    currentRecipient.value = event.target.value
    currentRecipient.docSignId = event.target.getAttribute("docsignid")
    currentRecipient.label = event.target.getAttribute("about")
    currentRecipient.email = event.target.getAttribute("email")
    this.setState({ currentRecipient })
  }

  setImages = () => {
    return this.state.imagePreviewUrl.map((img, index) => {
      return <div key={index + 1} className='d-flex mt-3 bg-white'>
        <img
          width={"100%"}
          className={"pdfpage"}
          id={'pg-' + (index + 1)}
          onLoadCapture={this.onPageLoad}
          onDragEnter={this.onDragOverCaptureImage}
          src={`${baseUrl}/upload/` + img}
          alt={index + 1} />
      </div>
    });
  }

  render() {
    const { seletedRecipient, selecteOptions, imagePreviewUrl, isDataStored } = this.state;
    return (
      <>
        <Form className='m-5' id='setsignForm'>
          {(!isDataStored) ?
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label className="text-secondary text-capitalize">All Recipients : </Label>
                  <Select
                    isSearchable
                    isMulti
                    value={seletedRecipient}
                    onChange={this.handleChange}
                    options={selecteOptions}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <>
                  <Label className="text-secondary text-capitalize">Click To Add Doc Sign Details : </Label>
                  <FormGroup>
                    <Button onClick={this.onsetDocSign} color="primary"> Add Doc Sign Details </Button>
                  </FormGroup>
                </>
              </Col>
            </Row>
            :
            <Row form>
              <Col md={6}>
                <Label className="text-secondary text-capitalize d-block">All Finalized Recipients For Doc Sign : </Label>
                {this.state.seletedRecipientsList.map((obj, index) => {
                  return (
                    <FormGroup check key={index} inline>
                      <Label check key={obj.value} className={"pr-2 text-uppercase text-info"} size="md">
                        <Input type="radio" name="finalizedrecipients" onChange={this.onCheckedChange} id={obj.docSignId} value={obj.value} email={obj.email} key={obj.email} about={obj.label} docsignid={obj.docSignId} />{' '}{obj.label}
                      </Label>
                    </FormGroup>
                  )
                })}
              </Col>
            </Row>
          }
          <Row form>
            <Col md={12}>
              <center><Label size="lg" className='align text-uppercase'> File Viewer</Label></center>
            </Col>
          </Row>
          <Row form>
            {
              (imagePreviewUrl.length > 0) ?
                <Dnd sender={this.state.sender} pageDetails={this.state.aboutPage} totalRecipients={this.state.selecteOptions} doc_signs_data={this.state.doc_signs_data} currentRecipient={this.state.currentRecipient} setImages={this.setImages()} />
                :
                <b>Document Not Found.!</b>
            }
          </Row>
        </Form>
      </>
    );
  }
}

export default withRouter(SetSign);
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

