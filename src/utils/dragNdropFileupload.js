import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import "./dragNdrop.css";
import { Button } from 'reactstrap';

class dragNdropFileupload extends Component {
    constructor() {
        super();
        this.state = {
            files: []
        };
    }

    onDrop = (files) => {
        this.setState({ files })
        this.props.onFileDrop(files[0]);
    };

    render() {
        const files = this.state.files.map(file => (
            <li key={file.name}>
                {file.name} - {file.size} bytes
            </li>
        ));

        return (
            <Dropzone onDrop={this.onDrop} accept={'image/png'} noClick={true} multiple={false} maxSize={1000000}>
                {({ getRootProps, getInputProps, isDragAccept, isDragReject, isDragActive, open }) => (
                    <section>
                        <div {...getRootProps({
                            className:
                                isDragActive ?
                                    isDragAccept ? 'acceptStyle baseStyle' : isDragReject ? 'rejectStyle baseStyle' : 'activeStyle baseStyle'
                                    : 'baseStyle'
                        })}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                            <Button color="primary mb-3" size="sm" onClick={open} >Open File Dialog</Button>
                            <em>(Only *.png images will be accepted)</em>
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
