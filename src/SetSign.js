import React, { Component } from "react";
import axios from "axios";
import { CustomInput, Form, FormGroup, Label, Col, Row, Input, Button } from 'reactstrap';
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
    // const { pageNumber, numPages } = this.state;

    return (
      <>
        <Form className='m-5'>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="exampleCustomSelect">Custom Select : </Label>
                <CustomInput type="select" id="exampleCustomSelect" name="customSelect">
                  <option value="">Select</option>
                  <option>Value 1</option>
                  <option>Value 2</option>
                  <option>Value 3</option>
                  <option>Value 4</option>
                  <option>Value 5</option>
                </CustomInput>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="examplePassword">Password</Label>
                <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={3}>
              <FormGroup>
                <Label size="lg"> Div Position :
                  <Label id="divpos" sm={2} size="lg">258,456</Label>
                </Label>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label size="lg"> Sign Position :
                  <Label id="signpos" sm={2} size="lg">258,456</Label>
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <Button onClick={this.onSendFile} >Send File</Button>
          <Row form>
            <Col md={5}></Col>
            <Col md={2}>
              <Label size="lg" className='align'> File Viewer</Label>
            </Col>
            <Col md={5}></Col>
          </Row>
          <Row form>
            <Col md={2}></Col>
            <Col md={8}>
              <div id="docPage" style={{ minWidth: '100%', border: '1px solid black', background: 'red' }}>

              </div>
            </Col>
            <Col md={2}></Col>
          </Row>
        </Form>
      </>
    );
  }
}



