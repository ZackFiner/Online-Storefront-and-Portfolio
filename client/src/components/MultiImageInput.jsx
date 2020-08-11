import React, { Component } from 'react';

import styled from 'styled-components';


const DeleteButton = styled.button.attrs({
    className: `close`
})`
`
const ImagePreview = styled.image.attrs({
    className: `draggable-image-preview`
})`
`
const DraggableImageFrame = styled.div.attrs({
    className: `draggable-image-frame`
})`
`
const DragableImageGrid = styled.div.attrs({
    className: `multiimageinput-grid`
})`
    display: inline-grid;
    grid-template-rows: auto;
`
const AddImageButton = styled.input.attrs({
    className: `image-input-frame`
})`
`

class DragableImage extends Component {
    constructor(props) {
        super(props);
        const {prev_url, id} = props.params.imageInfo;
        this.state = {
            prev_url:prev_url,
            id:id,
            name: props.params.name,
            onDelete: props.params.onDelete,
        };
    }

    render() {
        const {name, prev_url, id} = this.state;
        return (
            <DraggableImageFrame name={`frm-${name}`}>
                <DeleteButton name={name} onClick={this.state.onDelete} />
                <ImagePreview src={prev_url} />
            </DraggableImageFrame>
        )
    }
}
class MultiImageInput extends Component {
    constructor(props) {
        super(props);
        const itemId = Math.random().toString(36).substring(6, 15) + Math.random().toString(36).substring(6,15);
        this.state = {
            fileInputs: {},
            imageInputCount: 0,
            imageInputID: itemId,
            saltLength: itemId.length,
        }
    }
    handleAddImage = async event => {
        const targetFile = event.target.files[0];
        const prev_url = URL.createObjectURL(prev_url);
        const prevInputCount = this.state.imageInputCount;
        // there's probably a more efficent way to do this (dynamically add an entry to teh fileinputs object)
        // TODO: figure this out
        let prevFileInputs = { ...this.state.fileInputs};
        prevFileInputs[`ID#${prevInputCount}`] = {targetFile: targetFile, prev_url: prev_url, id: prevInputCount,};
        
        this.setState({
            fileInputs: prevFileInputs,
            imageInputCount: prevInputCount + 1,
        });
    }
    handleRemoveImage = async event => {
        const imageTag = event.target.name;
        const id = imageTag.substring(saltLength);
        let prevFileInputs = { ...this.state.fileInputs}
        delete prevFileInputs[`ID#${id}`];// remove the entry in question, also deleting predifined javascript objects can crash things
        
        this.setState({
            fileInputs: prevFileInputs,
        });
        // note that we are simply deleting an internal state value, we will need another way of removing the object from display
    }
    handleDragImage = async vent => {
    }
    componentDidMount = async () => {

    }

    render() {
        const outer_this = this;
        let imageElements = Object.entries(this.state.fileInputs).map((value, index, array) => {
            const {prev_url, id} = value[1];
            const imageInfo = {prev_url, id};
            const name = `${outer_this.state.imageInputID}${id}`;
            return (<DragableImage name={name} imageInfo={imageInfo} onDelete={outer_this.handleRemoveImage}/>)
        });

        return (
            <DragableImageGrid>
                {imageElements}
                <AddImageButton type='file' onChange={handleAddImage} />
            </DragableImageGrid>
        )
    }
}

export default MultiImageInput;