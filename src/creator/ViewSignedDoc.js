import React, { Component } from "react";
import axios from "axios";
import { Form, Label, Col, Row, Button } from 'reactstrap';
import './recipient.css';
import queryString from "query-string";
import { withRouter } from 'react-router-dom';
import { toastError, toastSuccess } from "../NotificationToast";


const baseUrl = process.env.REACT_APP_API_URL;
class ViewSignedDoc extends Component {
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
      docSignStatus: null,
      isLoading: true,
      imagePreviewUrl: '',
      documentDetails: null,
      signatureDetails: null,
      recipientDetails: null,
      docSignIds: null,
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
    let { docSignIds, documentDetails, recipientDetails, docSignStatus } = { ...this.state }
    return new Promise((resolve, reject) => {
      axios.get(`${baseUrl}/creator/doc-sign-review?token=${token}`)
        .then((response) => {
          docSignStatus = true;
          recipientDetails = response.data.data.map(({ recipient }) => (recipient))
          docSignIds = response.data.data.map(({ id }) => id);
          documentDetails = response.data.data[0].document;
          response.data.data.forEach(({ statusId }) => {
            if (statusId === 1) {
              docSignStatus = false;
            }
          });
          resolve({ docSignStatus, docSignIds, recipientDetails, documentDetails });
        })
        .catch((error) => {
          console.log("TCL: getDocSignDetails -> error", error)
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

  getSignLogs = (docSignIds) => {
    let { signLogs } = { ...this.state }
    let counter = 0;
    return new Promise((resolve, reject) => {
      docSignIds.forEach((docSignId) => {
        axios.get(`${baseUrl}/sign-logs/${docSignId}`)
          .then((response) => {
            if (response.data.data) {
              response.data.data.forEach(logObj => {
                signLogs.push(logObj)
              });
              ++counter;
              if (docSignIds.length === counter) {
                resolve({ signLogs })
              }
            }
          })
          .catch((error) => {
            toastError("sign-logs data fetch.!");
            reject(error);
          });
      });
    });
  }

  getSignature = (recipientDetails) => {
    let counter = 0;
    let signaturesDetails = []
    return new Promise((resolve, reject) => {
      recipientDetails.forEach((recipient) => {
        axios.get(`${baseUrl}/sign/${recipient.email}`)
          .then((response) => {
            ++counter;
            signaturesDetails.push(response.data.data)
            if (recipientDetails.length === counter) {
              resolve(signaturesDetails)
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    });
  }

  onLoadPdf = () => {
    let { imagePreviewUrl, docSignIds, documentDetails, signLogs, isLoading, recipientDetails, signatureDetails, docSignStatus } = { ...this.state }
    const token = queryString.parse(this.props.location.search).token;
    this.getDocSignDetails(token).then(docSignData => {
      recipientDetails = docSignData.recipientDetails;
      docSignIds = docSignData.docSignIds;
      docSignStatus = docSignData.docSignStatus;
      documentDetails = docSignData.documentDetails;
      this.getDocDetails(documentDetails.id).then(docData => {
        imagePreviewUrl = docData.imagePreviewUrl;
        this.getSignLogs(docSignIds).then(signLogsData => {
          signLogs = signLogsData.signLogs;
          this.getSignature(recipientDetails).then(signatureData => {
            signatureDetails = signatureData;
            recipientDetails = signatureDetails.map((sign, index) => {
              recipientDetails[index].signImg = `${baseUrl}/upload/signatures/${sign.name}`;
              return recipientDetails[index];
            })
            this.setState({ docSignStatus, signatureDetails, imagePreviewUrl, recipientDetails, documentDetails, docSignIds, signLogs, isLoading: !isLoading })
          }).catch(err => {
            this.setState({ docSignStatus, imagePreviewUrl, recipientDetails, documentDetails, docSignIds, signLogs, isLoading: !isLoading })
          });
        });
      })
    }).catch(error => {
      console.log("TCL: ViewSignedDoc -> onLoadPdf -> error", error);
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
      return <div key={index + 1} className='d-flex m-3 bg-white justify-content-center'>
        <img
          width={"100%"}
          className={"pdfpage"}
          id={'pg-' + (index + 1)}
          onLoadCapture={this.onLoadCaptureImage}
          src={`${baseUrl}/upload/` + img}
          alt={index + 1} />
      </div>
    });
  }

  getStyles = (left, top, pageheight, pagewidth) => {
    // console.log("TCL: ViewSignedDoc -> getStyles -> left, top, pageheight, pagewidth", left, top, pageheight, pagewidth)
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
    let { aboutPage, pageDetails, signatureDetails } = { ...this.state }
    return this.state.signLogs.map((signLog) => {
      let pageRatio = signLog.pageRatio.split(',')
      let left = ((parseFloat(pageRatio[0]) * parseFloat(pageDetails.pageWidth)) + parseInt(aboutPage[signLog.pageNo - 1].pageLeft));
      let top = ((parseFloat(pageRatio[1]) * parseFloat(pageDetails.pageHeight)) + parseInt(aboutPage[signLog.pageNo - 1].pageTop));
      let signPath = "";
      if (signLog.signId) {
        const index = signatureDetails.findIndex((objSign) => parseInt(objSign.id) === parseInt(signLog.signId));
        signPath = `${baseUrl}/upload/signatures/${signatureDetails[index].name}`;
      }
      return <div id={signLog.id} key={signLog.id} style={this.getStyles(left, top, pageDetails.pageHeight, pageDetails.pageWidth)}>
        <img
          className={(signLog.signId) ? "sign2" : "sign"}
          src={signPath}
          alt="" id={'s' + signLog.id} onClick={this.onSetSign} ></img>
      </div>
    })
  }

  onDownloadDoc = () => {
    const { signLogs, signatureDetails, documentDetails, docSignIds } = this.state;
    return new Promise((resolve, reject) => {
      axios.post(`${baseUrl}/document/download`, { signLogs, signatureDetails, documentDetails, docSignIds })
        .then((response) => {
          if (response.data) {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
              var a;
              if (xhttp.readyState === 4 && xhttp.status === 200) {
                a = document.createElement('a');
                a.href = window.URL.createObjectURL(xhttp.response);
                a.download = response.data.file;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                toastSuccess("Document Downloading Is Started ");
              }
            };
            xhttp.open("GET", `${baseUrl}/document/download/${response.data.file}`);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.responseType = 'blob';
            xhttp.send();
            resolve();
          }
        })
        .catch((error) => {
          reject(error)
        });
    });
  }

  render() {
    const { imagePreviewUrl, documentDetails, signLogs, aboutPage, isLoading, docSignStatus } = this.state;
    return (
      <>
        <Form className='mx-5' id='setsignForm'>
          {documentDetails !== null &&
            <>
              <Row form className="bg-secondary sticky-top">
                <Col md={12} color="primary">
                  <div style={{ height: "60px" }} className="d-flex flex-row align-items-center">
                    <div className="mr-3">
                      <Label size="sm" className='align text-white text-uppercase m-0'>- Download Document :</Label>
                    </div>
                    <div className="mr-3">
                      <Button color="success" id="btnFinalDocSignature" disabled={!docSignStatus} onClick={this.onDownloadDoc}>Download Document</Button>
                    </div>
                  </div>
                </Col>
              </Row>
              < Row form>
                <Col md={4}>
                  <center><Label size="lg" className='align text-primary text-uppercase'><Label className="text-secondary">-  Doc Sign Status :</Label> {(docSignStatus ? 'Finished' : 'Panding')} </Label></center>
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
                  <div id="signcontainer">
                    {(signLogs.length > 0 && aboutPage.length === documentDetails.totalPages) ? this.renderSignOnPosition() : ''}
                  </div>
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

export default withRouter(ViewSignedDoc);