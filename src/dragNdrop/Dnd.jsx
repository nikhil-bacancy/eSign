import React, { Component } from 'react';
import Source from './Source';
import axios from "axios";
import Target from './Target';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash';
import './Dnd.css';
import './source.css';
import { Button } from 'reactstrap';

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
    if (copyDropedComponent.id !== undefined) {
      newComponentsList = components.map((component) => {
        if (component.id === copyDropedComponent.id) {
          component.pageId = parseInt(this.props.pageDetails.pageId.slice(3));
          component.left = x
          component.top = y + document.documentElement.scrollTop
          component.signXCoord = x - pageDetails.pageLeft;
          component.signYCoord = (y + document.documentElement.scrollTop) - pageDetails.pageTop;
          component.recipientId = seletedRecipient.value;
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
      copyDropedComponent.component.docSignId = seletedRecipient.docSignId;
      newComponentsList = _.concat([], components, copyDropedComponent.component)
    }
    this.setState({
      components: newComponentsList,
    })
  }

  onSendFile = () => {
    const { components } = { ...this.state };
    let payload = components.map((obj) => {
      let docSignId = obj.docSignId;
      let pageNo = obj.pageId;
      let signCoord = obj.signXCoord + ',' + obj.signYCoord;
      let statusId = 1;
      let statusDate = Date.now();
      return { docSignId, pageNo, signCoord, statusId, statusDate };
    });

    axios.post(`${baseUrl}/signlogs`, payload)
      .then((response) => {
        console.log("TCL: Dnd -> onSendFile -> response", response)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { components } = this.state;
    const { setImages } = this.props;
    return (
      <>
        <Button color="warning" onClick={this.onSendFile} className="mb-5">Send File</Button>
        <DndProvider backend={HTML5Backend}>
          <div className="Dnd">
            <Source baseComponents={this.state.baseComponents} />
            <Target onDrop={this.onDrop} components={components} setImages={setImages} />
          </div>
        </DndProvider>
      </>
    );
  }
}

export default Dnd;
