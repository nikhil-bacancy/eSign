import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import './target.css';
import DraggableBox from "./DraggableBox";

class Target extends Component {
    render() {
        const { connectDropTarget, components, onDrop, setImages, pageDetails } = this.props;

        return (
            connectDropTarget(
                <div className="target flex-grow-1">
                    {
                        setImages.length && setImages
                    }
                    {
                        components.map((componentObj, index) => <DraggableBox key={index} onUpdate={onDrop} pageDetails={pageDetails} {...components[index]} />)
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
