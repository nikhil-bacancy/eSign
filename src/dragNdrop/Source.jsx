import React from 'react';
import { DragSource } from 'react-dnd';
import './source.css';
import ReactHtmlParser from 'react-html-parser';

class Source extends React.Component {

    getStyles = (pageheight, pagewidth) => {
        return {
            display: "flex",
            height: (pageheight / 35) + 'px',
            width: (pagewidth / 9) + 'px',
            cursor: 'move',
        }
    }

    render() {
        const { pageHeight, pageWidth } = this.props.pageDetails
        return (
            <div className="source">
                <ul>
                    {
                        this.props.baseComponents.map((baseComponent, index) => {
                            return <ListItem key={index} style={this.getStyles(pageHeight, pageWidth)} component={baseComponent} />
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
    const { connectDragSource, component, style } = props;
    return connectDragSource(<li><div style={style}>{ReactHtmlParser(component.component)}</div></li>)
});


export default Source

//  dangerouslySetInnerHTML={{ __html: component.component }}