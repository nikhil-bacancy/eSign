import React, { Component } from "react";
import axios from "axios";
import { Form, Label, Col, Row, Button } from 'reactstrap';
import './recipient.css';
import queryString from "query-string";
import { withRouter } from 'react-router-dom';
import { toastError } from "../NotificationToast";
import SignModal from "../popupModals/SignModal";
const signImg = require('./samplesign.png');


const baseUrl = process.env.REACT_APP_API_URL;
class DoSign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutPage: [],
      pageDetails: {
        pageId: null,
        pageTop: null,
        pageLeft: null,
        pageHeight: null,
        pageWidth: null
      },
      signatureUrl: null,
      open: false,
      isSignSet: false,
      isLoading: true,
      imagePreviewUrl: '',
      documentDetails: null,
      docId: null,
      docSignId: null,
      signLogs: [],
      clientImageHeight: null,
      clientImageWidth: null,
    };
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    let { pageDetails } = { ...this.state }
    if (document.getElementById('pg-1')) {
      pageDetails.pageHeight = document.getElementById('pg-1').clientHeight;
      pageDetails.pageWidth = document.getElementById('pg-1').clientWidth;
    }
    this.setState({ pageDetails })
  }

  componentDidMount = () => {
    window.addEventListener("resize", this.updateDimensions);
    this.onLoadPdf();
  }

  getDocSignDetails = (token) => {
    let { docId, docSignId, documentDetails } = { ...this.state }
    return new Promise((resolve, reject) => {
      axios.get(`${baseUrl}/recipient/doc-sing?token=${token}`)
        .then((response) => {
          docId = response.data.data.documentId;
          docSignId = response.data.data.id;
          documentDetails = {
            name: response.data.data.document.name,
            totalPages: response.data.data.document.totalPages,
            sender: response.data.data.creator.name
          }
          resolve({ docId, docSignId, documentDetails });
        })
        .catch(() => {
          toastError("Token Has Expired.!");
          reject("Token Has Expired.!")
        });
    });
  }

  getDocDetails = (docId) => {
    let { imagePreviewUrl } = { ...this.state }
    return new Promise((resolve, reject) => {
      axios.get(`${baseUrl}/getDoc/${docId}`)
        .then((response) => {
          if (response.data.data) {
            imagePreviewUrl = response.data.data
            resolve({ imagePreviewUrl });
          }
        })
        .catch((error) => {
          reject(error)
        });
    });
  }

  getSignLogs = (docSignId) => {
    let { signLogs } = { ...this.state }
    return new Promise((resolve, reject) => {
      axios.get(`${baseUrl}/sign-logs/${docSignId}`)
        .then((response) => {
          if (response.data.data) {
            signLogs = response.data.data
            resolve({ signLogs })
          }
        })
        .catch((error) => {
          toastError("sign-logs data fetch.!");
          reject(error);
        });
    });
  }

  onLoadPdf = () => {
    let { imagePreviewUrl, docId, docSignId, documentDetails, signLogs, isLoading } = { ...this.state }
    const token = queryString.parse(this.props.location.search).token;
    this.getDocSignDetails(token).then(docSignData => {
      docId = docSignData.docId;
      docSignId = docSignData.docSignId;
      documentDetails = docSignData.documentDetails;
      this.getDocDetails(docId).then(docData => {
        imagePreviewUrl = docData.imagePreviewUrl;
        this.getSignLogs(docSignId).then(signLogsData => {
          signLogs = signLogsData.signLogs;
          this.setState({ imagePreviewUrl, docId, documentDetails, docSignId, signLogs, isLoading: !isLoading })
        });
      })
    }).catch(error => {
      console.log("TCL: DoSign -> onLoadPdf -> error", error);
    })
  }

  onLoadCaptureImage = (event) => {
    let { aboutPage, pageDetails } = { ...this.state }
    pageDetails.pageId = event.target.id;
    pageDetails.pageTop = event.target.offsetTop;
    pageDetails.pageLeft = event.target.offsetLeft;
    pageDetails.pageHeight = event.target.height;
    pageDetails.pageWidth = event.target.width
    let obj = {
      pageId: event.target.id,
      pageTop: event.target.offsetTop,
      pageLeft: event.target.offsetLeft,
      pageHeight: event.target.height,
      pageWidth: event.target.width
    }
    aboutPage.push(obj)
    this.setState({ aboutPage, pageDetails })
  }

  setImages = () => {
    return this.state.imagePreviewUrl.map((img, index) => {
      return <div key={index + 1} className='d-flex m-3 bg-white'>
        <img
          width={"100%"}
          className={"pdfpage"}
          id={'pg-' + (index + 1)}
          onLoadCapture={this.onLoadCaptureImage}
          src={'http://192.168.1.49:8000/upload/' + img}
          alt={index + 1} />
      </div>
    });
  }

  getStyles = (left, top, pageheight, pagewidth) => {
    console.log("TCL: DoSign -> getStyles -> left, top, pageheight, pagewidth", left, top, pageheight, pagewidth)
    return {
      display: "flex",
      left: left,
      top: top,
      height: (pageheight / 35),
      width: (pagewidth / 9),
      cursor: 'pointer',
      position: 'absolute',
    }
  }

  renderSignOnPosition = () => {
    let { aboutPage, pageDetails } = { ...this.state }
    // console.log("TCL: DoSign -> renderSignOnPosition -> pageDetails", pageDetails)
    return this.state.signLogs.map((signLog) => {
      let pageRatio = signLog.pageRatio.split(',')
      let left = ((parseFloat(pageRatio[0]) * parseFloat(pageDetails.pageWidth)) + parseInt(aboutPage[signLog.pageNo - 1].pageLeft));
      let top = ((parseFloat(pageRatio[1]) * parseFloat(pageDetails.pageHeight)) + parseInt(aboutPage[signLog.pageNo - 1].pageTop));
      return <div id={signLog.id} key={signLog.id} style={this.getStyles(left, top, pageDetails.pageHeight, pageDetails.pageWidth)}><div className="sign"></div></div>
    })
  }

  toggle = () => {
    this.setState(({ open }) => ({ open: !open }));
  }

  onUploadSign = (isUpload, signatureUrl) => {
    this.setState({ isSignSet: isUpload, signatureUrl });
  }

  render() {
    const { imagePreviewUrl, documentDetails, signLogs, aboutPage, isLoading, isSignSet, signatureUrl } = this.state;
    return (
      <>
        <SignModal toggle={this.toggle} open={this.state.open} onUploadSign={this.onUploadSign} />
        <Form className='mx-5' id='setsignForm'>
          {documentDetails !== null &&
            <>
              <Row form className="bg-secondary sticky-top">
                <Col md={12} color="primary">
                  <div style={{ height: "60px" }} className="d-flex flex-row align-items-center">
                    <div className="mr-3">
                      <Label size="sm" className='align text-white text-uppercase m-0'>- Select Signature For The Document :</Label>
                    </div>
                    <div className="mr-3">
                      <div className="bg-white"><img src={signatureUrl ? signatureUrl : signImg} width="140px" height="45px" alt="not found" /></div>
                    </div>
                    <div className="mr-3">
                      {
                        isSignSet ?
                          <Button color="warning" onClick={this.toggle}>Edit</Button>
                          :
                          <Button color="primary" onClick={this.toggle}>Select Signature</Button>
                      }
                    </div>
                  </div>
                </Col>
              </Row>
              < Row form>
                <Col md={4}>
                  <center><Label size="lg" className='align text-primary text-uppercase'><Label className="text-secondary">-  Sender :</Label> {documentDetails.sender} </Label></center>
                </Col>
                <Col md={4}>
                  <center><Label size="lg" className='align text-primary text-uppercase'><Label className="text-secondary">-  Doc Name -</Label> <br />{documentDetails.name} </Label></center>
                </Col>
                <Col md={4}>
                  <center><Label size="lg" className='align text-primary text-uppercase'><Label className="text-secondary">-  Total Pages :</Label> {documentDetails.totalPages} </Label></center>
                </Col>
              </Row>
            </>
          }
          <Row form>
            <Col md={12}>
              <center><Label size="lg" className='align text-secondary text-uppercase'>- - - Do Sign On The Document - - -</Label></center>
            </Col>
          </Row>
          <Row form>
            <div className="signdocument flex-grow-1">
              {isLoading === false &&
                (imagePreviewUrl.length > 0) ?
                <>
                  {this.setImages()}

                  {(signLogs.length > 0 && aboutPage.length === documentDetails.totalPages) ? this.renderSignOnPosition() : ''}
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




  // onLoadPdf = () => {
  //   let { imagePreviewUrl, docId, docSignId, documentDetails, signLogs, isLoading } = { ...this.state }
  //   const token = queryString.parse(this.props.location.search).token;
  //   axios.get(`${baseUrl}/recipient/doc-sing?token=${token}`)
  //     .then((response) => {
  //       docId = response.data.data.documentId;
  //       docSignId = response.data.data.id;
  //       documentDetails = {
  //         name: response.data.data.document.name,
  //         totalPages: response.data.data.document.totalPages,
  //         sender: response.data.data.creator.name
  //       }
  //       axios.get(`${baseUrl}/getDoc/${docId}`)
  //         .then((response) => {
  //           if (response.data.data) {
  //             imagePreviewUrl = response.data.data
  //             axios.get(`${baseUrl}/sign-logs/${docSignId}`)
  //               .then((response) => {
  //                 if (response.data.data) {
  //                   signLogs = response.data.data
  //                   this.setState({ imagePreviewUrl, docId, documentDetails, docSignId, signLogs, isLoading: !isLoading })
  //                 }
  //               })
  //               .catch((error) => {
  //                 console.log('sign-logs data fetch error :', error);
  //               });
  //           }
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     })
  //     .catch(() => {
  //       toastError("Token Has Expired.!");
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