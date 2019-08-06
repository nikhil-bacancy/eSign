import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import './target.css';
import DraggableBox from "./DraggableBox";

class Target extends Component {
    render() {
        const { connectDropTarget, components, onDrop, imagePreviewUrl, setImages } = this.props;
        return (
            connectDropTarget(
                <div className="target flex-grow-1">
                    {
                        imagePreviewUrl.length && setImages
                    }
                    {
                        components.map((componentObj, index) => <DraggableBox key={index} onUpdate={onDrop} {...components[index]} />)
                    }
                </div>
            )
        )
    }
}

const spec = {
    drop(props, monitor, component) {
        const item = monitor.getItem()
        // console.log("TCL: drop -> item", component._reactInternalFiber.child.child.child)
        const clientOffset = monitor.getClientOffset()
        props.onDrop(item, clientOffset.x, clientOffset.y)
    },
}

const collect = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
    };
}

export default DropTarget('form-elements', spec, collect)(Target);
