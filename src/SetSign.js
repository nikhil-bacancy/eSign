import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import { Form, FormGroup, Label, Col, Row, Button } from 'reactstrap';

export default class SetSign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seletedRecipients: null,
      recipientList: [],
      selecteOptions: [],
      imagePreviewUrl: '',
      pdfPreviewUrls: [],
      divPos: [],
      signPos: [],
      docId: 1,
      doc_signs_data : []
    };
  }

  componentDidMount = () => {
    axios.get('http://localhost:8000/getRecipientList/')
    .then((response) => {
      let {selecteOptions,recipientList} = this.state;
      recipientList = response.data.data
      selecteOptions = response.data.data.map(({ id, name }) => {
          let value = id;
          let label = name;
          return { value, label };
      });
      this.setState({recipientList, selecteOptions})
    })
    .catch((error) => {
      console.log(error);
    });
    this.onLoadPdf();
  }

  onLoadPdf = () => {
    axios.get(`http://localhost:8000/getDoc/${this.state.docId}`)
    .then((response) => {
      if(response.data.data){
        this.setState({ imagePreviewUrl: response.data.data })
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  onsetDocSign = () => {
    axios.post('http://localhost:8000/docsing/',this.state.doc_signs_data)
    .then((response) => {
       
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
  
  handleChange = selectedOption => {
    let { seletedRecipients,doc_signs_data } = this.state;
    seletedRecipients = selectedOption;
    if(seletedRecipients){
      doc_signs_data = selectedOption.map(({ value }) => {
          let documentId = 1 , organizationId = 1, creatorId = 1 , recipientId = value;
          let statusId = 1 , statusDate = Date.now();
          return { documentId, organizationId, creatorId, recipientId, statusId, statusDate };
      });
    }else{
      doc_signs_data = []
    }
     this.setState({ seletedRecipients,doc_signs_data });
  };

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
    axios.post('http://localhost:8000/pdftohtml/', this.formdataCoverter(payload))
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  setImages = () => {
    return this.state.imagePreviewUrl.map((img,index) => <img width='100%' border="5" height='100%' key={index+1} src={'http://localhost:8000/upload/' + img} alt={index+1} />)
  }

  // getCords = () => {
  //   this.setState({
  //     divPos: this.getPositionXY(),
  //     signPos: this.getPositionXYSign()
  //   })
  // }

  // getPositionXY = (event) => {
  //   var element = document.getElementById('docPage');
  //   var rect = element.getBoundingClientRect();
  //   document.getElementById('divpos').innerText = rect.x + ',' + rect.y
  //   return [rect.x, rect.y];
  // }

  // getPositionXYSign = (onStopEventXYvalue) => {
  //   var element = document.getElementById('sign');
  //   var rect = element.getBoundingClientRect();
  //   document.getElementById('signpos').innerText = rect.x + ',' + rect.y
  //   return [rect.x, rect.y]
  // }

  render() {
    const { seletedRecipients, selecteOptions, imagePreviewUrl } = this.state;
    return (
      <>
        <Form className='m-5'>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label>Select Recipient: </Label>
                <Select
                      isMulti
                      isSearchable
                      value={seletedRecipients}
                      onChange={this.handleChange}
                      options={selecteOptions}
                    />
              </FormGroup>
            </Col>
            <Col md={6}>
              <Label>Set Doc Sign : </Label>
              <FormGroup>
                <Button onClick={this.onsetDocSign} > Add Details </Button>
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
            <Col md={12}>
              <center><Label size="lg" className='align'> File Viewer</Label></center>
            </Col>
          </Row>
          <Row form>
            <Col md={2}></Col>
            <Col md={8}>
              <div id="docPage" style={{  border: '1px solid black' }}>
                  {
                    imagePreviewUrl.length &&
                    <center>  
                      {this.setImages()}
                    </center>
                  }
              </div>
            </Col>
            <Col md={2}></Col>
          </Row>
        </Form>
      </>
    );
  }
}



