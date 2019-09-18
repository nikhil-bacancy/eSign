import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import "./dragNdrop.css";
import { Button } from 'reactstrap';
import { toastError } from "../NotificationToast";
class dragNdropFileupload extends Component {
    constructor() {
        super();
        this.state = {
            files: []
        };
    }

    onDrop = (acceptedFiles, rejectedFiles, event) => {
        this.setState({ acceptedFiles })
        if (this.props.isMultiple) {

        } else {
            const promise = new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsDataURL(acceptedFiles[0])
                reader.onload = () => {
                    if (!!reader.result) {
                        resolve(reader.result)
                    }
                    else {
                        reject(Error("Failed converting to base64"))
                    }
                }
            })
            promise.then(result => {
                this.props.onFileDrop(result, event);
            }, err => {
                toastError("Invalid Image")
            })
        }
    };

    render() {
        const files = this.state.files.map(file => (
            <li key={file.name}>
                {file.name} - {file.size} bytes
            </li>
        ));

        return (
            <Dropzone onDrop={this.onDrop} accept={'image/png'} noClick={true} multiple={this.props.isMultiple} maxSize={1000000}>
                {({ getRootProps, getInputProps, isDragAccept, isDragReject, isDragActive, open }) => (
                    <section>
                        <div {...getRootProps({
                            className:
                                isDragActive ?
                                    isDragAccept ? 'acceptStyle baseStyle' : isDragReject ? 'rejectStyle baseStyle' : 'activeStyle baseStyle'
                                    : 'baseStyle'
                        })}>
                            <input name={this.props.name} {...getInputProps()} />
                            <center>
                                <p className={(this.props.boxSize === 'small') ? 'small' : ''}>Drag 'n' drop files here /</p>
                                <Button color="primary mb-3 d-block" size="sm" onClick={open} >{this.props.uploadFor}</Button>
                                {(this.props.isInsideText) && <em className={(this.props.boxSize === 'small') ? 'small' : ''}>(Allowed File Type : *.png)</em>}
                            </center>
                        </div>
                        {this.props.showFileMeta &&
                            < aside >
                                <h6>Files</h6>
                                <ul><h6>{files}</h6></ul>
                            </aside>
                        }
                    </section>
                )
                }
            </Dropzone>
        );
    }
}


export default dragNdropFileupload;
