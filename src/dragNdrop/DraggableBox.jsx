import React from 'react'
import { useDrag } from 'react-dnd'
import ReactHtmlParser from 'react-html-parser';

function getStyles(left, top, isDragging, pageDetails) {
  const { pageHeight, pageWidth } = pageDetails
  return {
    position: 'absolute',
    left: left,
    top: top,
    height: (pageHeight / 35),
    width: (pageWidth / 9),
    cursor: 'move',
    opacity: isDragging ? 0.5 : 1,
  }
}

export default function DraggableBox(props) {
  const { id, title, left, top, component, onUpdate, pageDetails } = props
  const [{ isDragging }, drag,] = useDrag({
    item: { type: component, id, left, top, title, component },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const clientOffset = monitor.getClientOffset()
      onUpdate(item, clientOffset.x, clientOffset.y)
    },
  })

  return (
    <div ref={drag} style={getStyles(left, top, isDragging, pageDetails)}>
      {
        ReactHtmlParser(component)
      }
    </div>
  )
}