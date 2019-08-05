import React from 'react';
import { DragSource } from 'react-dnd';
import './source.css';
import ReactHtmlParser from 'react-html-parser';

class Source extends React.Component {
    render() {
        return (
            <div className="source">
                <ul>
                    {
                        this.props.baseComponents.map((baseComponent, index) => {
                            return <ListItem key={index} component={baseComponent} />
                        })
                    }
                </ul>
            </div>
        )
    }
}

const spec = {
    beginDrag(props, monitor, component) {
        const item = { ...props };
        return item;
    }
};

const collect = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource()
    };
}

const ListItem = DragSource("form-elements", spec, collect)(props => {
    const { connectDragSource, component, } = props;
    return connectDragSource(<li><div>{ReactHtmlParser(component.component)}</div></li>)
});


export default Source

//  dangerouslySetInnerHTML={{ __html: component.component }}