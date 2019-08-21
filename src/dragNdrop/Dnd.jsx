import React, { Component } from 'react';
import Source from './Source';
import axios from "axios";
import Target from './Target';
import { DndProvider } from 'react-dnd';
import { isMobile } from 'react-device-detect';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend'
import _ from 'lodash';
import './Dnd.css';
import './source.css';
import { Button } from 'reactstrap';
import { toastError, toastSuccess, toastDefault } from '../NotificationToast';

const baseUrl = process.env.REACT_APP_API_URL;
class Dnd extends Component {
  constructor() {
    super();
    this.state = {
      baseComponents: [
        {
          component: "<div class=basecomponent></div>",
          title: 'signature'
        },
      ],
      components: [],
    }
  }

  onDrop = (dropedComponent, x, y) => {
    const { components } = this.state;
    const { currentRecipient, pageDetails } = this.props;
    const copyDropedComponent = JSON.parse(JSON.stringify(dropedComponent));
    let newComponentsList;
    if (currentRecipient) {

      let left = (x - ((pageDetails.pageWidth / 9) / 2));
      let top = ((y - ((pageDetails.pageHeight / 35) / 2)) + window.pageYOffset);//document.documentElement.scrollTop);

      if (copyDropedComponent.id !== undefined) {
        newComponentsList = components.map((component) => {
          if (component.id === copyDropedComponent.id) {
            component.pageId = parseInt(this.props.pageDetails.pageId.slice(3));
            component.left = left
            component.top = top
            component.signXCoord = (left - pageDetails.pageLeft);
            component.signYCoord = (top - pageDetails.pageTop);
            component.recipientId = currentRecipient.value;
            component.recipientEmail = currentRecipient.email;
            component.docSignId = currentRecipient.docSignId;
          }
          return component
        })
      } else {
        copyDropedComponent.component.id = components.length;
        copyDropedComponent.component.pageId = parseInt(this.props.pageDetails.pageId.slice(3));
        copyDropedComponent.component.left = left
        copyDropedComponent.component.top = top
        copyDropedComponent.component.signXCoord = (left - pageDetails.pageLeft);
        copyDropedComponent.component.signYCoord = (top - pageDetails.pageTop);
        copyDropedComponent.component.recipientId = currentRecipient.value;
        copyDropedComponent.component.recipientEmail = currentRecipient.email;
        copyDropedComponent.component.docSignId = currentRecipient.docSignId;
        newComponentsList = _.concat([], components, copyDropedComponent.component)
      }
      this.setState({
        components: newComponentsList,
      })
    } else {
      toastDefault("Please Select Recipient.!")
    }
  }

  onSendFile = () => {
    const { components } = { ...this.state };
    let payload = {}
    const { pageWidth, pageHeight } = this.props.pageDetails;
    if (components.length) {
      payload.docSignLogs = components.map((obj) => {
        let docSignId = obj.docSignId;
        let pageNo = obj.pageId;
        let signCoord = obj.signXCoord + ',' + obj.signYCoord;
        let pageRatio = (obj.signXCoord / pageWidth) + ',' + (obj.signYCoord / pageHeight);
        let statusId = 1;
        let statusDate = Date.now();
        return { docSignId, pageNo, signCoord, pageRatio, statusId, statusDate };
      });
      payload.recipientsList = this.props.totalRecipients;
      payload.sender = this.props.sender;
      axios.post(`${baseUrl}/signlogs`, payload)
        .then((response) => {
          toastSuccess(response.data.message)
        })
        .catch((error) => {
          toastError(error.message)
        });
    } else {
      if (this.props.currentRecipient) {
        toastDefault("No Signature Found.!")
      } else {
        toastDefault("Please Select Recipient.!")
      }
    }
  }

  render() {
    const { components } = this.state;
    const { setImages, pageDetails } = this.props;
    return (
      <>
        <Button color="warning" onClick={this.onSendFile} className="mb-5">Send File</Button>
        <DndProvider backend={(isMobile) ? TouchBackend : HTML5Backend}>
          <div className="Dnd">
            <Source pageDetails={pageDetails} baseComponents={this.state.baseComponents} />
            <Target onDrop={this.onDrop} pageDetails={pageDetails} components={components} setImages={setImages} />
          </div>
        </DndProvider>
      </>
    );
  }
}

export default Dnd;
