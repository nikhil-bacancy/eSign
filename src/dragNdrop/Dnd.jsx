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
    const { seletedRecipient, pageDetails } = this.props;
    const copyDropedComponent = JSON.parse(JSON.stringify(dropedComponent));
    let newComponentsList;
    if (seletedRecipient) {
      if (copyDropedComponent.id !== undefined) {
        newComponentsList = components.map((component) => {
          if (component.id === copyDropedComponent.id) {
            component.pageId = parseInt(this.props.pageDetails.pageId.slice(3));
            component.left = x
            component.top = y + document.documentElement.scrollTop
            component.signXCoord = x - pageDetails.pageLeft;
            component.signYCoord = (y + document.documentElement.scrollTop) - pageDetails.pageTop;
            component.recipientId = seletedRecipient.value;
            component.recipientEmail = seletedRecipient.email;
            component.docSignId = seletedRecipient.docSignId;
          }
          return component
        })
      } else {
        copyDropedComponent.component.id = components.length;
        copyDropedComponent.component.pageId = parseInt(this.props.pageDetails.pageId.slice(3));
        copyDropedComponent.component.left = x;
        copyDropedComponent.component.top = y + document.documentElement.scrollTop;
        copyDropedComponent.component.signXCoord = x - pageDetails.pageLeft;
        copyDropedComponent.component.signYCoord = (y + document.documentElement.scrollTop) - pageDetails.pageTop;
        copyDropedComponent.component.recipientId = seletedRecipient.value;
        copyDropedComponent.component.recipientEmail = seletedRecipient.email;
        copyDropedComponent.component.docSignId = seletedRecipient.docSignId;
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
      if (this.props.seletedRecipient) {
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
