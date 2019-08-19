import React, { Component } from "react";
import axios from "axios";
import { Form, Label, Col, Row } from 'reactstrap';
import './recipient.css';
import queryString from "query-string";
import { withRouter } from 'react-router-dom';
import { toastError } from "../NotificationToast";

const baseUrl = process.env.REACT_APP_API_URL;
class DoSign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutPage: [],
      imagePreviewUrl: '',
      documentDetails: null,
      docId: null,
      docSignId: null,
      signLogs: [],
      clientImageHeight: null,
      clientImageWidth: null,
    };
  }

  componentDidMount = () => {
    this.onLoadPdf();
  }

  onLoadPdf = () => {
    let { imagePreviewUrl, docId, docSignId, documentDetails, signLogs } = { ...this.state }
    const token = queryString.parse(this.props.location.search).token;
    axios.get(`${baseUrl}/recipient/doc-sing?token=${token}`)
      .then((response) => {
        docId = response.data.data.documentId;
        docSignId = response.data.data.id;
        documentDetails = {
          name: response.data.data.document.name,
          totalPages: response.data.data.document.totalPages,
          sender: response.data.data.creator.name
        }
        axios.get(`${baseUrl}/getDoc/${docId}`)
          .then((response) => {
            if (response.data.data) {
              imagePreviewUrl = response.data.data
              axios.get(`${baseUrl}/sign-logs/${docSignId}`)
                .then((response) => {
                  if (response.data.data) {
                    signLogs = response.data.data
                    this.setState({ imagePreviewUrl, docId, documentDetails, docSignId, signLogs })
                  }
                })
                .catch((error) => {
                  console.log('sign-logs data fetch error :', error);
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch(() => {
        toastError("Token Has Expired.!");
      });
  }

  onLoadCaptureImage = (event) => {
    let { aboutPage } = { ...this.state }
    let obj = {
      pageId: event.target.id,
      pageTop: event.target.offsetTop,
      pageLeft: event.target.offsetLeft,
      pageHeight: event.target.height,
      pageWidth: event.target.width
    }
    aboutPage.push(obj)
    this.setState({ aboutPage })
  }

  setImages = () => {
    return this.state.imagePreviewUrl.map((img, index) => <div key={index + 1} className='d-flex m-3 bg-secondary'><img width={"100%"} className={"pdfpage"} id={'pg-' + (index + 1)} onLoadCapture={this.onLoadCaptureImage} src={'http://192.168.1.49:8000/upload/' + img} alt={index + 1} /></div>);
  }

  getStyles = (left, top, ) => {
    return {
      position: 'absolute',
      left: left + 'px',
      top: top + 'px',
      cursor: 'move',
    }
  }

  renderSignOnPosition = () => {
    let { aboutPage } = { ...this.state }
    // console.log("TCL: DoSign -> renderSignOnPosition -> aboutPage", aboutPage)
    // if (aboutPage.length > 0) {
    return this.state.signLogs.map((signLog) => {
      console.log("TCL: DoSign -> renderSignOnPosition -> signLog - pageNo", aboutPage[signLog.pageNo - 1].pageTop, signLog.pageNo)
      let pageRatio = signLog.pageRatio.split(',')
      let left = ((parseFloat(pageRatio[0]) * parseFloat(aboutPage[signLog.pageNo - 1].pageWidth)) + parseInt(aboutPage[signLog.pageNo - 1].pageLeft));
      let top = ((parseFloat(pageRatio[1]) * parseFloat(aboutPage[signLog.pageNo - 1].pageHeight)) + parseInt(aboutPage[signLog.pageNo - 1].pageTop));
      return <div className="sign" id={signLog.id} key={signLog.id} style={this.getStyles(left, top)}></div>
    })
    // }
  }

  render() {
    const { imagePreviewUrl, documentDetails, signLogs, aboutPage } = this.state;
    return (
      <>
        <Form className='m-5' id='setsignForm'>
          {documentDetails !== null &&
            < Row form>
              <Col md={4}>
                <center><Label size="lg" className='align text-primary text-uppercase'><Label className="text-secondary">-  Sender :</Label> {documentDetails.sender} </Label></center>
              </Col>
              <Col md={4}>
                <center><Label size="lg" className='align text-primary text-uppercase'><Label className="text-secondary">-  Doc Name :</Label> {documentDetails.name} </Label></center>
              </Col>
              <Col md={4}>
                <center><Label size="lg" className='align text-primary text-uppercase'><Label className="text-secondary">-  Total Pages :</Label> {documentDetails.totalPages} </Label></center>
              </Col>
            </Row>
          }
          <Row form>
            <Col md={12}>
              <center><Label size="lg" className='align text-secondary text-uppercase'>- - - Do Sign On The Document - - -</Label></center>
            </Col>
          </Row>
          <Row form>
            <div className="signdocument flex-grow-1">
              {
                (imagePreviewUrl.length > 0) ?

                  <>
                    {
                      this.setImages()
                    }
                    {
                      (signLogs.length > 0 && aboutPage.length === documentDetails.totalPages) && this.renderSignOnPosition()
                    }
                  </>
                  :
                  <center><p className="text-white text-uppercase mt-5">No Document Found..!</p></center>
              }
            </div>
          </Row>
        </Form>
      </>
    );
  }
}

export default withRouter(DoSign);





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

// getDocSignDetails = (token) => {
//   let { docId, docSignId, documentDetails } = { ...this.state }
//   return new Promise((resolve, reject) => {
//     axios.get(`${baseUrl}/recipient/doc-sing?token=${token}`)
//       .then((response) => {
//         docId = response.data.data.documentId;
//         docSignId = response.data.data.id;
//         documentDetails = {
//           name: response.data.data.document.name,
//           totalPages: response.data.data.document.totalPages,
//           sender: response.data.data.creator.name
//         }
//         resolve({ docId, docSignId, documentDetails });
//       })
//       .catch(() => {
//         toastError("Token Has Expired.!");
//         reject("Token Has Expired.!")
//       });
//   });
// }

// getDocDetails = (docId) => {
//   let { imagePreviewUrl } = { ...this.state }
//   return new Promise((resolve, reject) => {
//     axios.get(`${baseUrl}/getDoc/${docId}`)
//       .then((response) => {
//         if (response.data.data) {
//           imagePreviewUrl = response.data.data
//           resolve({ imagePreviewUrl });
//         }
//       })
//       .catch((error) => {
//         reject(error)
//       });
//   });
// }

// getSignLogs = (docSignId) => {
//   let { signLogs } = { ...this.state }
//   return new Promise((resolve, reject) => {
//     axios.get(`${baseUrl}/sign-logs/${docSignId}`)
//       .then((response) => {
//         if (response.data.data) {
//           signLogs = response.data.data
//           resolve({ signLogs })
//         }
//       })
//       .catch((error) => {
//         toastError("sign-logs data fetch.!");
//         reject(error);
//       });
//   });
// }

// onLoadPdf = () => {
//   let { imagePreviewUrl, docId, docSignId, documentDetails, signLogs } = { ...this.state }
//   const token = queryString.parse(this.props.location.search).token;
//   this.getDocSignDetails(token).then(docSignData => {
//     docId = docSignData.docId;
//     docSignId = docSignData.docSignId;
//     documentDetails = docSignData.documentDetails;
//     this.getDocDetails(docId).then(docData => {
//       imagePreviewUrl = docData.imagePreviewUrl;
//       this.getSignLogs(docSignId).then(signLogsData => {
//         signLogs = signLogsData.signLogs;
//         this.setState({ imagePreviewUrl, docId, documentDetails, docSignId, signLogs })
//       });
//     })
//   }).catch(error => {
//     console.log("TCL: DoSign -> onLoadPdf -> error", error)
//   })
// }