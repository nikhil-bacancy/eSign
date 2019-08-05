import React from 'react'
import { useDrag } from 'react-dnd'
import ReactHtmlParser from 'react-html-parser';

function getStyles(left, top, isDragging) {
  return {
    position: 'absolute',
    left: left,
    top: top,
    cursor: 'move',
    opacity: isDragging ? 0.5 : 1,
    height: isDragging ? 0 : '',
  }
}

// export default DraggableBox = (props) => {
//   // const { id, title, xCoord, yCoord, component, onUpdate, imagePreviewUrl, setImages } = props
//   // console.log("TCL: setImages", setImages)

//   // const [{ isDragging }, drag,] = useDrag({
//   //   item: { type: component, id, xCoord, yCoord, title, component },
//   //   collect: monitor => ({
//   //     // isDragging: monitor.isDragging(),
//   //   }),
//   //   end: (item, monitor) => {
//   //     const clientOffset = monitor.getClientOffset()
//   //     onUpdate(item, clientOffset.x, clientOffset.y)
//   //   },
//   // })

//   // return (
//   //   <div ref={drag} style={getStyles(xCoord, yCoord, isDragging)}>
//   //     {
//   //       imagePreviewUrl.length &&
//   //       <center>
//   //         {ReactHtmlParser(component)}
//   //         {props.setImages}
//   //       </center>
//   //     }

//   //   </div>
//   // )
// }


export default function DraggableBox(props) {
  const { id, title, xCoord, yCoord, component, onUpdate } = props

  const [{ isDragging }, drag,] = useDrag({
    item: { type: component, id, xCoord, yCoord, title, component },
    collect: monitor => ({
      // isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const clientOffset = monitor.getClientOffset()
      onUpdate(item, clientOffset.x, clientOffset.y)
    },
  })

  return (
    <div ref={drag} style={getStyles(xCoord, yCoord, isDragging)}>
      {
        ReactHtmlParser(component)
      }
    </div>
  )
}
