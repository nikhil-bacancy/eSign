import React, { Component } from 'react';
import Source from './Source';
import Target from './Target';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash';
import './Dnd.css';
import './source.css';
import { Button } from 'reactstrap';

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
    const { seletedRecipient } = this.props;
    const copyDropedComponent = JSON.parse(JSON.stringify(dropedComponent));
    let newComponentsList;
    if (copyDropedComponent.id !== undefined) {
      newComponentsList = components.map((component) => {
        if (component.id === copyDropedComponent.id) {
          component.pageId = this.props.pageId;
          component.xCoord = x
          component.recipientId = seletedRecipient.value;
          component.yCoord = y + document.documentElement.scrollTop
        }
        return component
      })
    } else {
      copyDropedComponent.component.id = 'sign-' + components.length;
      copyDropedComponent.component.pageId = this.props.pageId;
      copyDropedComponent.component.xCoord = x;
      copyDropedComponent.component.yCoord = y + document.documentElement.scrollTop;
      copyDropedComponent.component.recipientId = seletedRecipient.value;
      newComponentsList = _.concat([], components, copyDropedComponent.component)
    }
    this.setState({
      components: newComponentsList,
    })
  }

  onSendFile = () => {

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
