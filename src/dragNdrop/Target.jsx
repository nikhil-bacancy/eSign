import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import './target.css';
import DraggableBox from "./DraggableBox";

class Target extends Component {
    render() {
        const { connectDropTarget, components, onDrop, imagePreviewUrl, setImages } = this.props;
        return (
            connectDropTarget(
                <div className="target">
                    {
                        imagePreviewUrl.length && <center>{setImages}</center>
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
